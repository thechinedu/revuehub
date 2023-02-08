import { Compartment, StateField } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  WidgetType,
} from "@codemirror/view";

import { renderToStaticMarkup } from "react-dom/server";

import { AddCommentBox } from "../AddCommentBox";

type AddCommentBoxProperties = any;

class AddCommentBoxCompartmentStore {
  store: Map<number, AddCommentBoxProperties> = new Map();

  add(key: number) {
    this.store.set(key, {});
  }

  remove(pos: number) {
    this.store.delete(pos);
  }

  generateDecorations() {
    return Array.from(this.store.keys()).map((key) =>
      commentBoxDecorationSet(+key)
    );
  }
}

export const addCommentBoxStore = new AddCommentBoxCompartmentStore();

class CommentBoxWidget extends WidgetType {
  view: EditorView | null;

  constructor() {
    super();

    this.view = null;
  }

  toDOM(view: EditorView): HTMLElement {
    this.view = view;

    const container = document.createElement("div");
    const commentBox = renderToStaticMarkup(<AddCommentBox />);

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
  }
}

export const commentBoxDecorationSet = (pos: number) =>
  StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(value, trx) {
      console.log("updating comment box", { value, trx });
      const commentBoxDecoration = Decoration.widget({
        widget: new CommentBoxWidget(),
        block: true,
      });

      return Decoration.set([commentBoxDecoration.range(pos)]);
    },

    provide: (f) => EditorView.decorations.from(f),
  });

export const addCommentBoxCompartment = new Compartment();
