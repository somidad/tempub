import type { EditorConfig } from "@ckeditor/ckeditor5-core";

interface TextTransformationDescription {
  from: string | RegExp;
  to:
    | string
    | Array<null | string>
    | ((arr: Array<string>) => Array<null | string>);
}

interface TextTransformationConfig {
  extra?: Array<string | TextTransformationDescription>;
  include?: Array<string | TextTransformationDescription>;
  remove?: Array<string | TextTransformationDescription>;
}

interface TypingConfig {
  transformations: TextTransformationConfig;
  undoStep?: number;
}

type HeadingOption = HeadingElementOption | HeadingParagraphOption;

interface ElementObjectDefinition {
  attributes?: Record<string, string>;
  classes?: string | Array<string>;
  name: string;
  priority?: number;
  styles?: Record<string, string>;
}

type ElementDefinition = string | ElementObjectDefinition;

interface HeadingElementOption {
  class: string;
  icon?: string;
  model:
    | "heading1"
    | "heading2"
    | "heading3"
    | "heading4"
    | "heading5"
    | "heading6";
  title: string;
  view: ElementDefinition;
}

interface HeadingParagraphOption {
  class: string;
  icon?: string;
  model: "paragraph";
  title: string;
}

interface HeadingConfig {
  options?: Array<HeadingOption>;
}

interface FixedEditorConfig extends EditorConfig {
  typing?: TypingConfig;
  heading?: HeadingConfig;
}

const editorConfig: FixedEditorConfig = {
  typing: {
    transformations: {
      include: [],
      remove: ["quotes"],
    },
  },
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "|",
    "bulletedList",
    "numberedList",
    "indent",
    "outdent",
    "|",
    "imageUpload",
    "insertTable",
    "blockQuote",
    "|",
    "undo",
    "redo",
  ],
  heading: {
    options: [
      {
        model: "paragraph",
        title: "Paragraph",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Heading 5",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6",
        view: "h6",
        title: "Heading 6",
        class: "ck-heading_heading6",
      },
    ],
  },
};

export default editorConfig;
