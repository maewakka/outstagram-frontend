import React, { useEffect, useState } from 'react';
import style from './Post.module.css';
import PostFile from "./PostFile";
import PostWrite from "./PostWrite";
import multiFileAxios from "../../components/axios/multiFileAxios";
import { useNavigate } from "react-router-dom";

const PostContainer = () => {

    const navigate = useNavigate();

    /* 게시글 변경 */
    const [write, setWrite] = useState();
    const [files, setFiles] = useState();
    const [fileNum, setFileNum] = useState(0);
    const [loading, setLoading] = useState(false); // 로딩 상태 추가

    const onChangeWrite = (e) => {
        setWrite(e.target.value);
    }

    const onChangeFiles = (inputs) => {
        setFiles(inputs);
    };

    const fileNumInc = () => {
        if (fileNum < files.length - 1) {
            setFileNum(fileNum + 1);
        }
    }

    const fileNumDec = () => {
        if (fileNum > 0) {
            setFileNum(fileNum - 1);
        }
    }

    const onSubmit = () => {
        if (!files || files.length === 0) {
            alert("사진을 선택하세요");
            return;
        }

        console.log(write);

        setLoading(true); // 공유 중 로딩 상태 시작

        const formData = new FormData();
        const size = files.length;

        for (let i = 0; i < size; i++) {
            formData.append("file", files[i]);
        }
        formData.append("content", JSON.stringify(write));

        multiFileAxios.post('/post', formData)
            .then((response) => {
                alert(response.data);
                navigate("/outstagram/home");
            })
            .catch((error) => {
                alert("업로드 실패");
                setLoading(false); // 실패 시 로딩 상태 해제
            });
    }

    useEffect(() => {
    }, [files]);

    return (
        <div className={style.post_container}>
            <div className={style.post_header_container}>
                <div />
                <div>
                    새 게시물 만들기
                </div>
                <div 
                    className={style.submit} 
                    onClick={!loading ? onSubmit : null}  // 로딩 중일 때 클릭 불가
                    style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                    {loading ? <div className={style.spinner}></div> : '공유하기'}
                </div>
            </div>
            <div className={style.post_body_container}>
                <PostFile
                    files={files}
                    fileNum={fileNum}
                    fileNumInc={fileNumInc}
                    fileNumDec={fileNumDec}
                    onChangeFiles={onChangeFiles}
                />
                <PostWrite onChangeWrite={onChangeWrite} />
            </div>
        </div>
    );
};

export default PostContainer;
