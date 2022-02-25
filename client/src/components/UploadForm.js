import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "./UploadForm.module.scss";
import ProgressBar from "./ProgressBar";

function UploadForm() {
  const dragRef = useRef(null);
  // 11 file을 files로 수정
  // const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  // const [fileName, setFileName] = useState("");
  const fileId = useRef(0);

  const [percent, setPercent] = useState([]);

  const fileSubmitHandler = async () => {
    console.log("submit 함수 실행 check");
    const formData = new FormData();

    try {
      await Promise.all(
        [...files].map((file, index) => {
          console.log("file ; ", file);
          formData.delete("image");
          formData.append("image", file.object);

          const res = axios
            .post("/upload", formData, {
              headers: { "Content-Type": "multi/form-data" },
              onUploadProgress: (e) => {
                setPercent((prevData) => {
                  const newData = [...prevData];
                  newData[index] = Math.round((100 * e.loaded) / e.total);
                  return newData;
                });
              },
            })
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const imageSelectHandler = useCallback(
    (e) => {
      let selectedFiles = [];
      let tempFiles = files;

      if (e.type === "drop") {
        //// 22
        //// selectedFile = e.dataTransfer.files[0];
        selectedFiles = e.dataTransfer.files;
      } else {
        //// 33
        //// selectedFile = e.target.files[0];
        selectedFiles = e.target.files;
      }
      // console.log("selectedFile : ", selectedFile);
      // console.log("selectedFiles : ", selectedFiles);

      for (const file of selectedFiles) {
        tempFiles = [
          ...tempFiles,
          {
            id: fileId.current++,
            object: file,
          },
        ];
      }

      setFiles(tempFiles);
    },
    [files]
  );

  const deleteFileRow = (id) => {
    console.log("삭제 버튼 클릭");
    //
    // setFileNames("");
    setFiles(files.filter((file) => file.id !== id));
  };

  // 드롭 이벤트 영역 start
  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log("drag enter");
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    imageSelectHandler(e);
    console.log("drop event !!");
  });

  const initDragEvents = useCallback(() => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", handleDragIn);
      dragRef.current.addEventListener("dragleave", handleDragOut);
      dragRef.current.addEventListener("dragover", handleDragOver);
      dragRef.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback(() => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener("dragenter", handleDragIn);
      dragRef.current.removeEventListener("dragleave", handleDragOut);
      dragRef.current.removeEventListener("dragover", handleDragOver);
      dragRef.current.removeEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  // 드롭 이벤트 영역 end
  // template area
  // file row
  const fileNameRows = () => {
    console.log("files.length : ", files.length);
    console.log(typeof files.length);

    return files.map((file, i) => {
      console.log("file in rowtemplate : ", file);
      const {
        id,
        object: { name },
      } = file;

      return (
        <div className={styles.fileRowTemplate} key={file.id}>
          <div>{file.id}</div>

          <div>{name}</div>
          {/**
            <ProgressBar percent="20" />
           */}
          <ProgressBar percent={percent[i]} />

          <div>
            <button
              onClick={() => {
                // console.log("버튼 클릭")
                deleteFileRow(id);
              }}
            >
              ❌
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.UploadFormContainer}>
      <div className={styles.FileDropContainer}>
        <h2>파일 첨부 컴퍼넌트</h2>

        <label className={styles.InputFileLabel} htmlFor="input-file">
          파일 선택
        </label>

        <input
          id="input-file"
          type="file"
          className={styles.InputFileButton}
          onChange={imageSelectHandler}
          multiple={true}
        />

        <div className={styles.fileDropBox} ref={dragRef}>
          {files.length > 0 ? fileNameRows() : "파일을 업로드 하세요"}
        </div>

        <button
          className={styles.FileSubmitButton}
          onClick={fileSubmitHandler}
          type="submit"
        >
          제출
        </button>
      </div>
    </div>
  );
}

export default UploadForm;
