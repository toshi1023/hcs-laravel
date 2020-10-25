import React, {useMemo, useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import {useDropzone} from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(10),
        paddinfTop: theme.spacing(10),
        paddingBottom: theme.spacing(10),
    },
    delete: {
        marginLeft: theme.spacing(4),
        fontSize: 15,
    },
    fileLabel: {
        paddingTop: theme.spacing(3),
    },
    fileTitle: {
        fontSize: 13,
    }
}))

/**
 * 画像ドロップの枠組み
 */
const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

/**
 * 画像プレビューのスタイル
 */
const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 200,
    height: 150,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };

export default function ProfileDropzone(props) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
      accept: 'image/*',
    //   画像プレビューの設定
      onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }    
    });
    
  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  /**
   * 画像プレビュー表示の関数
   */
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  /**
   * ファイル名の表示
   */
  const filename = files.map(file => (
      <Grid container>
          <Grid item xs={12} sm={10} md={10} lg={10}>
            <li key={file.path}>
                <span className={classes.fileTitle}>{file.path} - {file.size} bytes</span>
            </li>
          </Grid>
      </Grid>
  ));

  /**
   * アップロードファイルの削除
   */
  const handleDelete = () => {
    setFiles([])
  }

  return (
      <>
        <Grid container>
            <Grid item xs={11} sm={10} md={10} lg={10}>
                <div className="container">
                    <div {...getRootProps({style})} className={classes.root}>
                        <input {...getInputProps()} />
                        <p>ファイルをドロップする</p>
                        <aside style={thumbsContainer}>
                            {thumbs}
                        </aside>
                        <input
                          type="file"
                          id="imageInput"
                          hidden={true} // 非表示を設定
                        />
                    </div>
                </div>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item xs={4}>
                <Button variant="contained" color="secondary" className={classes.delete} onClick={handleDelete}>削除</Button>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item xs={4}>
                <aside>
                    <h4 className={classes.fileLabel}>Files</h4>
                    {filename}
                </aside>
            </Grid>
        </Grid>
      </>
  );
}
