import { Compartment, StateField } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  WidgetType,
} from "@codemirror/view";

import { renderToStaticMarkup } from "react-dom/server";

import { AddCommentBox, AddCommentBoxProps } from "../AddCommentBox";

export const addCommentBoxStore = {
  store: new Map<number, AddCommentBoxProps>(),

  add(key: number) {
    if (this.store.has(key)) return;

    this.store.set(key, {
      value: "",
      isFileComment: false,
      isSubmitDisabled: true,
    });
  },

  get(key: number) {
    return this.store.get(key);
  },

  remove(key: number) {
    this.store.delete(key);
  },

  update(key: number, props: AddCommentBoxProps) {
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
      isFileComment: false,
      isSubmitDisabled: true,
    };

    // console.log("toDOM", { v: props.value });

    const container = document.createElement("div");
    const commentBox = renderToStaticMarkup(
      <AddCommentBox
        value={props.value}
        isFileComment={props.isFileComment}
        isSubmitDisabled={props.isSubmitDisabled}
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
      console.log("submit", this.view);
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

    widgetContainer.addEventListener("change", (evt) => {
      const checkboxElem = evt.target as HTMLInputElement;

      if (checkboxElem.nodeName !== "INPUT") return;

      const { checked: isFileComment } = checkboxElem;

      addCommentBoxStore.update(this.key, { isFileComment });
    });
  }
}

export const commentBoxDecorationSet = (pos: number) =>
  StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(value, trx) {
      // console.log("updating comment box", { value, trx });
      const commentBoxDecoration = Decoration.widget({
        widget: new CommentBoxWidget(pos),
        block: true,
      });

      return Decoration.set([commentBoxDecoration.range(pos)]);
    },

    provide: (f) => EditorView.decorations.from(f),
  });

export const addCommentBoxCompartment = new Compartment();
