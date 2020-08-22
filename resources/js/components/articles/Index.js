import React, { useState, useEffect } from 'react';
import HcsAppBar from '../parts/appBar';
import ArticleCard from '../parts/articleCard';
import PrefectureSelects from '../parts/articleSearch';
import axios from 'axios';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '20px'
    },
    
  }));

function Article() {
    const classes = useStyles();
    const [articles, setArticles] = useState([]);

    const getArticles = async () => { 
        await axios
        .get('/api/api_articles')
        .then(({data}) => {
          setArticles({
            ...articles, 
            articles: data.articles,
            women_only: data.women_only_articles,
            prefectures: data.prefectures
          })
        })
        .catch(() => {
            return '通信に失敗しました';
        });
    }

    // 記事の取得を実行
    useEffect(() => {
        getArticles()
    },[])
    
    const renderArticles = () => {
        return _.map(articles.articles, article => (
            <Grid item xs={12} sm={6}>
                <ArticleCard key={article.id} article={article} />
            </Grid>
        ))
    }
    console.log(articles)
    return (
        <>
            <HcsAppBar />
            <PrefectureSelects values={articles.prefectures} />
            <Grid container className={classes.gridContainer} justify="center">
                {renderArticles()}
            </Grid>
        </>
    );
}

export default Article;