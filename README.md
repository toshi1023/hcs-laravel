現在以下のエラー発生中

実行コマンド：php artisan route:list

 Illuminate\Contracts\Container\BindingResolutionException 

  Target class [App\Service\DatabaseInterface] does not exist.

  at vendor/laravel/framework/src/Illuminate/Container/Container.php:807
    803| 
    804|         try {
    805|             $reflector = new ReflectionClass($concrete);
    806|         } catch (ReflectionException $e) {
  > 807|             throw new BindingResolutionException("Target class [$concrete] does not exist.", 0, $e);
    808|         }
    809| 
    810|         // If the type is not instantiable, the developer is attempting to resolve
    811|         // an abstract type such as an Interface or Abstract Class and there is

  1   [internal]:0
      App\Service\ArticleService::__construct()

  2   [internal]:0
      Illuminate\Foundation\Console\RouteListCommand::Illuminate\Foundation\Console\{closure}(Object(Illuminate\Routing\Route))
