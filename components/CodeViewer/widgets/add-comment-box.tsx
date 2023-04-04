import { post } from "@/utils";

import { Compartment, StateField } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  WidgetType,
} from "@codemirror/view";

import { renderToStaticMarkup } from "react-dom/server";

import { AddCommentBox, AddCommentBoxProps } from "../AddCommentBox";
import { multiLineCommentStore } from "./add-comment";
import { lineHighlightCompartment } from "./line-highlight";

type CommentBoxStore = AddCommentBoxProps & {
  snippet?: string;
  startLine?: number;
  endLine?: number;
};

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

  update(key: number, props: CommentBoxStore) {
    if (!this.store.has(key)) return;

    const state = this.store.get(key);

    this.store.set(key, { ...state, ...props });
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

    const props = addCommentBoxStore.get(this.key) || {
      value: "",
      isSubmitDisabled: true,
      commentLineReference: "",
      snippet: "",
    };

    const container = document.createElement("div");
    const commentBox = renderToStaticMarkup(
      <AddCommentBox
        value={props.value}
        isSubmitDisabled={props.isSubmitDisabled}
        commentLineReference={props.commentLineReference}
      />
    );

    container.classList.add("cm-comment-box");
    container.innerHTML = commentBox;

    this.attachListeners(container);

    return container;
  }

  attachListeners(widgetContainer: HTMLDivElement) {
    widgetContainer.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const store = addCommentBoxStore.get(this.key);
      console.log("submit", { store: { ...store, insertion_pos: this.key } });
    });

    widgetContainer.addEventListener("keyup", (evt) => {
      const textAreaElem = evt.target as HTMLTextAreaElement;
      const submitBtn = widgetContainer.querySelector(
        "button[type=submit]"
      ) as HTMLButtonElement;

      if (textAreaElem.nodeName !== "TEXTAREA") return;

      const { value } = textAreaElem;

      addCommentBoxStore.update(this.key, { value });

      if (value.trim().length) {
        submitBtn.disabled = false;
        addCommentBoxStore.update(this.key, { isSubmitDisabled: false });
      } else {
        submitBtn.disabled = true;
        addCommentBoxStore.update(this.key, { isSubmitDisabled: true });
      }
    });

    widgetContainer.addEventListener("click", (evt) => {
      const cancelBtn = evt.target as HTMLButtonElement;

      if (cancelBtn.dataset.action !== "reset" || this.view == null) return;

      const { startLine, endLine } = addCommentBoxStore.get(this.key) || {};

      if (startLine && endLine) {
        for (let i = startLine; i <= endLine; i++) {
          multiLineCommentStore.remove(i);
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
