import { CommentRequest, CreateCommentResponse } from "@/types";
import { post } from "@/utils";

import { Compartment, StateField } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  WidgetType,
} from "@codemirror/view";

import { renderToStaticMarkup } from "react-dom/server";
import { commentToCommentBoxProperty } from "../CodeViewer";

import {
  CommentBoxProps,
  CommentBoxContainer,
  CommentBoxMode,
} from "../CommentBox";
import { multiLineCommentStore } from "./add-comment";
import { lineHighlightCompartment } from "./line-highlight";

type CommentBoxStore = CommentBoxProps[];

// General store for shared data
export const codeViewerStore = new Map<
  | "filePath"
  | "repositoryID"
  | "showCommentsElemRef"
  | "updateComments"
  | "comments",
  | string
  | number
  | HTMLInputElement
  | ((comments: CommentBoxProps[]) => void)
  | CommentBoxProps[]
>();

const uniqueKeyGenerator =
  (initKey = 0) =>
  () =>
    ++initKey;

export const generateKey = uniqueKeyGenerator();

const extractInsertionPosFromKey = (key: string) => {
  const [_, insertionPos] = key.split("_");
  return +insertionPos;
};

export const addCommentBoxStore = {
  store: new Map<string, CommentBoxStore>(),

  add(insertionPos: number, value: CommentBoxStore) {
    const key = `${generateKey()}_${insertionPos}`;

    if (this.store.has(key)) return;

    this.store.set(key, value);
  },

  get(key: string) {
    return this.store.get(key);
  },

  hasInsertionPos(insertionPos: number) {
    return Array.from(this.store.keys()).some((key) =>
      key.endsWith(`_${insertionPos}`)
    );
  },

  canAddCommentBox(insertionPos: number): boolean {
    const insertionPosItems: CommentBoxStore[] = [];

    Array.from(this.store.entries()).forEach(([key, value]) => {
      if (extractInsertionPosFromKey(key) === insertionPos) {
        insertionPosItems.push(value);
      }
    });

    for (const item of insertionPosItems) {
      if (item[0].mode === CommentBoxMode.ADD) return false;
    }

    return true;
  },

  remove(key: string) {
    this.store.delete(key);
  },

  update(key: string, newStore: CommentBoxStore) {
    if (!this.store.has(key)) return;

    const existingComments = this.store.get(key) as CommentBoxStore;

    this.store.set(key, newStore);
  },

  reset() {
    this.store.clear();
  },

  generateDecorations() {
    return Array.from(this.store.keys()).map((key) =>
      commentBoxDecorationSet(key)
    );
  },
};

class CommentBoxWidget extends WidgetType {
  view: EditorView | null;

  constructor(private key: string) {
    super();

    this.view = null;
  }

  toDOM(view: EditorView): HTMLElement {
    this.view = view;

    const props = addCommentBoxStore.get(this.key) || [];

    const container = document.createElement("div");
    const commentBox = renderToStaticMarkup(
      <CommentBoxContainer comments={props} mode={CommentBoxMode.ADD} />
    );

    container.classList.add("cm-comment-box");
    container.innerHTML = commentBox;

    this.attachListeners(container);

    return container;
  }

  attachListeners(widgetContainer: HTMLDivElement) {
    widgetContainer.addEventListener("submit", async (evt) => {
      if (!this.view) return;

      evt.preventDefault();
      const formElem = evt.target as HTMLFormElement;
      const pos = formElem.dataset.elemPos as string;
      const store = addCommentBoxStore.get(this.key);
      const insertionPos = extractInsertionPosFromKey(this.key);

      if (store && store[+pos]) {
        const commentBox = store[+pos];

        const commentRequestBody = {
          content: commentBox.value as string,
          file_path: codeViewerStore.get("filePath") as string,
          repository_id: codeViewerStore.get("repositoryID") as number,
          start_line: commentBox.startLine,
          end_line: commentBox.endLine,
          snippet: commentBox.snippet,
          level: "LINE" as CommentRequest["level"],
          insertion_pos: insertionPos,
        };

        try {
          const res = await post<CommentRequest, CreateCommentResponse>(
            "/comments",
            commentRequestBody
          );
          const newComment = commentToCommentBoxProperty(res.data);

          const comments = codeViewerStore.get("comments") as CommentBoxProps[];
          const setComments = codeViewerStore.get("updateComments") as (
            comment: CommentBoxProps[]
          ) => void;

          setComments(
            [...comments, newComment].sort(
              (a, b) => (a.insertionPos as number) - (b.insertionPos as number)
            )
          );

          const trx = this.view.state.update({
            effects: [addCommentBoxCompartment.reconfigure([])],
          });
          this.view.dispatch(trx);
          addCommentBoxStore.reset();
        } catch (err) {
          console.log(err);
        }
      }
    });

    widgetContainer.addEventListener("keyup", (evt) => {
      const textAreaElem = evt.target as HTMLTextAreaElement;
      const submitBtn = widgetContainer.querySelector(
        "button[type=submit]"
      ) as HTMLButtonElement;

      if (textAreaElem.nodeName !== "TEXTAREA") return;

      const { value } = textAreaElem;
      const pos = textAreaElem.dataset.elemPos as string;

      const store = addCommentBoxStore.get(this.key);

      if (store) {
        const commentBox = store[+pos];

        commentBox.value = value;

        if (value.trim().length) {
          submitBtn.disabled = false;
          commentBox.isSubmitDisabled = false;
        } else {
          submitBtn.disabled = true;
          commentBox.isSubmitDisabled = true;
        }
      }
    });

    widgetContainer.addEventListener("click", (evt) => {
      const btn = evt.target as HTMLButtonElement;

      if (btn.dataset.action !== "reset" || this.view == null) return;

      const store = addCommentBoxStore.get(this.key);

      if (store) {
        if (store.length === 1 && store[0].mode === CommentBoxMode.ADD) {
          const { startLine, endLine } = store[0];

          if (startLine && endLine) {
            for (let i = startLine; i <= endLine; i++) {
              multiLineCommentStore.remove(i);
            }
          }

          addCommentBoxStore.remove(this.key);
        }

        const itemPos = +(btn.dataset.elemPos as string);
        const commentBox = store[itemPos];

        if (commentBox.mode === CommentBoxMode.ADD) {
          store.splice(itemPos, 1);
        } else {
          commentBox.mode = CommentBoxMode.READ;
        }

        const trx = this.view.state.update({
          effects: [
            addCommentBoxCompartment.reconfigure(
              addCommentBoxStore.generateDecorations()
            ),
            lineHighlightCompartment.reconfigure(
              multiLineCommentStore.highlightLines()
            ),
          ],
        });
        this.view.dispatch(trx);
      }
    });

    widgetContainer.addEventListener("focusin", (evt) => {
      if (!this.view) return;

      console.log("focus event");
      const inputElem = evt.target as HTMLInputElement;

      if (inputElem.nodeName !== "INPUT") return;

      console.log("input has focus");

      const store = addCommentBoxStore.get(this.key);
      console.log({ store });

      if (store) {
        const newCommentBox: CommentBoxStore[number] = {
          ...store[0],
          isSubmitDisabled: true,
          commentLineReference: "",
          value: "",
          mode: CommentBoxMode.ADD,
        };

        store.push(newCommentBox);

        console.log(addCommentBoxStore.get(this.key), "after update");

        const trx = this.view.state.update({
          effects: [
            addCommentBoxCompartment.reconfigure(
              addCommentBoxStore.generateDecorations()
            ),
          ],
        });
        this.view.dispatch(trx);
      }
    });
  }
}

export const commentBoxDecorationSet = (key: string) =>
  StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update() {
      const commentBoxDecoration = Decoration.widget({
        widget: new CommentBoxWidget(key),
        block: true,
      });

      return Decoration.set([
        commentBoxDecoration.range(extractInsertionPosFromKey(key)),
      ]);
    },

    provide: (f) => EditorView.decorations.from(f),
  });

export const addCommentBoxCompartment = new Compartment();
