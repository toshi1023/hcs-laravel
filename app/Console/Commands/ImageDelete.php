<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ImageDelete extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'image:delete';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'DBに存在しない画像をストレージから削除します';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            // ユーザ情報の取得
            $users = DB::select('select name, users_photo_path from users')->get();

            // 各フォルダに保管しているイメージ名を取得
            $user_folder = 'awsパス'.$user;
            $storage_communities = Storage::files('public/images/communities');
            $storage_community_locations = Storage::files('public/images/community_locations');
            // $storage_user_locations = Storage::files('public/images/user_locations');
            $storage_news = Storage::files('public/images/news');

            // DBに存在しないファイル名のファイルがストレージにある場合は削除
            foreach($users as $value) {
                // ユーザのフォルダ名を取得
                $user_folder = 'awsパス'.$value->name;
                // ユーザの保存イメージを取得
                $user_file = Storage::files($user_folder);
                if(!DB::table('users')->where('users_photo_path', basename($user_file))->exists()) {
                    Storage::delete('awsパス'.basename($user_file));
                }
            }
            foreach($storage_communities as $value) {
                if(!DB::table('communities')->where('image_file', basename($value))->exists()) {
                    Storage::delete("public/images/communities/".basename($value));
                }
            }
            foreach($storage_community_locations as $value) {
                if(!DB::table('community_locations')->where('image_file', basename($value))->exists()) {
                    Storage::delete("public/images/community_locations/".basename($value));
                }
            }
            foreach($storage_news as $value) {
                if(!DB::table('news')->where('image_file', basename($value))->exists()) {
                    Storage::delete("public/images/news/".basename($value));
                }
            }
            logger()->info('All images delete Completed! .');

        } catch(\Exception $e) {
            logger()->error($e->getMessage());
        }
    }
}
