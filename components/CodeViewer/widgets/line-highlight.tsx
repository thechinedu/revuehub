import { Compartment, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";

export const lineHighlightCompartment = new Compartment();

export const lineDecoration = Decoration.line({
  class: "cm-highlight-line",
});

export const lineDecorationSet = (pos: number) =>
  StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update() {
      return Decoration.set([lineDecoration.range(pos)]);
    },

    provide: (f) => EditorView.decorations.from(f),
  });
