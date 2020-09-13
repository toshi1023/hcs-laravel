import React, { useEffect } from 'react';
import styles from './TaskList.module.css';
import { useSelector, useDispatch } from 'react-redux';

// import { fetchAsyncProf } from '../login/loginSlice';
import { selectArticles, fetchAsyncGet } from './articleSlice';

const Article = () => {
    // stateのarticlesという値を使用できるようにローカルのarticles定数に格納
    const articles = useSelector(selectArticles)
    const dispatch = useDispatch()

    useEffect(() => {
        // 非同期の関数を定義
        const fetchArticleProf = async () => {
            // 記事一覧とログイン情報を取得
            await dispatch(fetchAsyncGet())
            // await dispatch(fetchAsyncProf())
        }
        // 上で定義した非同期の関数を実行
        fetcArticleProf()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    return (
        <div>
            <ul className={styles.taskList}>
                {/* useEffectで取得したtasksのデータをtaskに格納し、TaskItemコンポーネントに渡す */}
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </ul>
        </div>
    )
}

export default Article