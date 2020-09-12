<?php

use Illuminate\Database\Seeder;

class ArticleImagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Model\ArticleImage::create([
            'article_photo_name' => 'NoImage',
            'article_photo_path' => env('AWS_NOIMAGE'),
            'article_id'         => 1,
            'user_id'            => 1,
        ]);
        \App\Model\ArticleImage::create([
            'article_photo_name' => 'NoImage',
            'article_photo_path' => env('AWS_NOIMAGE'),
            'article_id'         => 2,
            'user_id'            => 1,
        ]);
    }
}
