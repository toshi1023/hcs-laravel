<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Article;

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
       return view('articles/create');
   }
}
