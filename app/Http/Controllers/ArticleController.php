<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Article;

use App\Prefecture;

class ArticleController extends Controller
{
    public function index()
    {
        // 記事を全て取得
        $articles = Article::all();

        return view('articles/index', [
            'articles' => $articles,
        ]);
    }

    public function showCreateForm()
   {
        $prefectures = Prefecture::all();

       return view('articles/create', [
           'prefectures' => $prefectures,
       ]);
   }

   //    記事登録処理
   public function create(Request $request)
   {

    $article = new Article();

    // 記事の内容を登録
    $article->prefecture = $request->prefecture;
    $article->title = $request->title;
    $article->content = $request->content;

    $article->save();

    return redirect()->route('articles.index');

   }
}
