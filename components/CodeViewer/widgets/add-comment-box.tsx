import { post } from "@/utils";

import { Compartment, StateField } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  WidgetType,
} from "@codemirror/view";

import { renderToStaticMarkup } from "react-dom/server";

import {
  CommentBoxProps,
  CommentBoxContainer,
  CommentBoxMode,
} from "../CommentBox";
import { multiLineCommentStore } from "./add-comment";
import { lineHighlightCompartment } from "./line-highlight";

type CommentBoxStore = (CommentBoxProps & {
  snippet?: string;
  startLine?: number;
  endLine?: number;
})[];

// General store for all comment boxes for shared data
export const codeViewerStore = new Map<
  "filePath" | "repositoryID",
  string | number
>();

export const addCommentBoxStore = {
  store: new Map<number, CommentBoxStore>(),

  add(key: number, value: CommentBoxStore) {
    if (this.store.has(key)) return;

    this.store.set(key, value);
  },

  get(key: number) {
    return this.store.get(key);
  },

  remove(key: number) {
    this.store.delete(key);
  },

  update(key: number, newComment: CommentBoxStore) {
    if (!this.store.has(key)) return;

    const existingComments = this.store.get(key) as CommentBoxStore;

    this.store.set(key, [...existingComments, ...newComment]);
  },

  reset() {
    this.store.clear();
  },

  generateDecorations() {
    return Array.from(this.store.keys()).map((key) =>
      commentBoxDecorationSet(+key)
    );
  },
};

class CommentBoxWidget extends WidgetType {
  view: EditorView | null;

  constructor(private key: number) {
    super();

    this.view = null;
  }

  toDOM(view: EditorView): HTMLElement {
    this.view = view;

    const props = addCommentBoxStore.get(this.key) || [];

    const container = document.createElement("div");
    const commentBox = renderToStaticMarkup(
      <CommentBoxContainer comments={props} />
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

      if (store && store[+pos]) {
        const commentBox = store[+pos];

        const commentRequestBody = {
          content: commentBox.value,
          file_path: codeViewerStore.get("filePath"),
          repository_id: codeViewerStore.get("repositoryID"),
          start_line: commentBox.startLine,
          end_line: commentBox.endLine,
          snippet: commentBox.snippet,
          level: "LINE",
          insertion_pos: this.key,
        };

        console.log({ commentRequestBody });

        try {
          const jsonRes = await post("/comments", commentRequestBody);
          // Successfully added comment
          // Update comment box store, set mode to read (read mode has a reply input box at the bottom)
          // Update view to show the comment box in read mode
          commentBox.mode = CommentBoxMode.READ;

          const trx = this.view.state.update({
            effects: [
              addCommentBoxCompartment.reconfigure(
                addCommentBoxStore.generateDecorations()
              ),
            ],
          });
          this.view.dispatch(trx);

          console.log({ jsonRes });
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
      const cancelBtn = evt.target as HTMLButtonElement;

      if (cancelBtn.dataset.action !== "reset" || this.view == null) return;

      const store = addCommentBoxStore.get(this.key);

      if (store) {
        const { startLine, endLine } = store[0];

        if (startLine && endLine) {
          for (let i = startLine; i <= endLine; i++) {
            multiLineCommentStore.remove(i);
          }
        }
      }

      addCommentBoxStore.remove(this.key);

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
    });

    widgetContainer.addEventListener("focusin", (evt) => {
      if (!this.view) return;

      console.log("focus event");
      const inputElem = evt.target as HTMLInputElement;

      if (inputElem.nodeName !== "INPUT") return;

      console.log("input has focus");

      const store = addCommentBoxStore.get(this.key);

      if (store) {
        const newCommentBox: CommentBoxStore[number] = {
          ...store[0],
          isSubmitDisabled: true,
          commentLineReference: "",
          value: "",
          mode: CommentBoxMode.ADD,
        };

        store.push(newCommentBox);

        addCommentBoxStore.update(this.key, store);

        const trx = this.view.state.update({
          effects: [
            addCommentBoxCompartment.reconfigure(
              addCommentBoxStore.generateDecorations()
            ),
          ],
        });
        this.view.dispatch(trx);

        // commentBox.value = value;

        // if (value.trim().length) {
        //   submitBtn.disabled = false;
        //   commentBox.isSubmitDisabled = false;
        // } else {
        //   submitBtn.disabled = true;
        //   commentBox.isSubmitDisabled = true;
        // }
      }
    });
  }
}

export const commentBoxDecorationSet = (pos: number) =>
  StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update() {
      const commentBoxDecoration = Decoration.widget({
        widget: new CommentBoxWidget(pos),
        block: true,
      });

      return Decoration.set([commentBoxDecoration.range(pos)]);
    },

    provide: (f) => EditorView.decorations.from(f),
  });

export const addCommentBoxCompartment = new Compartment();
