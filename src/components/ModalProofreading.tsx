import { createRef, useEffect, useState } from "react";
import { EditorState, RenderResult } from "../App";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-custom-build/build/ckeditor";
import readerConfig from "../readerConfig";

type Props = {
  onClose?: () => void;
  editorState?: EditorState;
  renderList: RenderResult[];
  KEY: string;
};

export default function ModalProofreading({
  onClose,
  editorState,
  renderList,
  KEY,
}: Props) {
  const [keyIndex, setKeyIndex] = useState(-1);
  const refReader = createRef<CKEditor<ClassicEditor>>();

  useEffect(() => {
    setKeyIndex(-1);
  }, [editorState]);

  const onChangeKeyIndex = (keyIndex: number) => {
    setKeyIndex(keyIndex);
    refReader.current?.editor?.data.set(renderList[keyIndex].rendered);
    refReader.current?.editor?.enableReadOnlyMode("proofreading");
  };

  const isActive =
    editorState === EditorState.Publishing ||
    editorState === EditorState.Displaying
      ? "is-active"
      : "";

  const matchedKeyGroupList: number[][] = [];
  renderList.forEach((render, index) => {
    const groupIndex = matchedKeyGroupList.findIndex((matchedKeyGroup) => {
      if (!matchedKeyGroup.length) {
        return false;
      }
      return render.rendered === renderList[matchedKeyGroup[0]].rendered;
    });
    if (groupIndex === -1) {
      matchedKeyGroupList.push([index]);
    } else {
      matchedKeyGroupList[groupIndex].push(index);
    }
  });

  return (
    <div className={`modal ${isActive}`}>
      <div className="modal-background" onClick={onClose}></div>
      {editorState === EditorState.Publishing && (
        <div className="modal-content">
          <progress className="progress" max="100"></progress>
        </div>
      )}
      {editorState === EditorState.Displaying && (
        <div
          className="modal-card"
          style={{
            width: "calc(100vw - 40px)",
            height: "calc(100vh - 40px)",
          }}
        >
          <div className="modal-card-head">
            <div className="modal-card-title">Proofreading</div>
          </div>
          <div className="modal-card-body">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="menu" style={{ minWidth: "160px" }}>
                {matchedKeyGroupList.map((matchedKeyGroup, index) => (
                  <>
                    <div key={index} className="menu-label">
                      Group {index}
                    </div>
                    <ul className="menu-list">
                      {matchedKeyGroup.map((matchedKey) => (
                        <li key={(renderList[matchedKey] as any)[KEY]}>
                          <a
                            className={
                              matchedKey === keyIndex ? "is-active" : ""
                            }
                            onClick={() => onChangeKeyIndex(matchedKey)}
                          >
                            {(renderList[matchedKey] as any)[KEY]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ))}
              </div>
              <div style={{ flexGrow: "1" }}>
                <div className="content">
                  <CKEditor
                    editor={ClassicEditor}
                    config={readerConfig}
                    ref={refReader}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-card-foot"></div>
        </div>
      )}
    </div>
  );
}
