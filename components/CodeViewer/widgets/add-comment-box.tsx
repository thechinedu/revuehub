import { Compartment, StateField } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  WidgetType,
} from "@codemirror/view";

import { renderToStaticMarkup } from "react-dom/server";

import { AddCommentBox } from "../AddCommentBox";

class CommentBoxWidget extends WidgetType {
  toDOM(view: EditorView): HTMLElement {
    const container = document.createElement("div");
    const commentBox = renderToStaticMarkup(<AddCommentBox />);

    container.innerHTML = commentBox;

    // ret.addEventListener("click", () => {
    //   const trx = view.state.update({
    //     // effects: addCommentBoxCompartment.of({ from: 60, to: 82 }),
    //     // effects:
    //   });
    //   view.dispatch({
    //     effects: addCommentBoxCompartment.reconfigure([
    //       commentBoxDecorationSet(60),
    //     ]),
    //   });
    // });

    return container;
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
        widget: new CommentBoxWidget(),
        block: true,
      });

      return Decoration.set([commentBoxDecoration.range(pos)]);
    },

    provide: (f) => EditorView.decorations.from(f),
  });

export const addCommentBoxCompartment = new Compartment();
