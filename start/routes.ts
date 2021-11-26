/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Route.get('/', async ({ view }) => {
//   return view.render('panel/pages/menus/mainMenu')
// })

Route.get('/panel', async () => {
  const { default: IndexController } = await import(
    'App/Controllers/Http/panel/IndexController'
  )

  return new IndexController().index()
});

Route.post('/panel/client/:client_id/menus/store', async (ctx) => {
  const { default: MenusController } = await import(
    'App/Controllers/Http/MenusController'
  )

  return new MenusController().store(ctx)
});

Route.post('/panel/client/store', async (ctx) => {
  const { default: ClientsController } = await import(
    'App/Controllers/Http/ClientsController'
  )

  return new ClientsController().store(ctx)
});

Route.post('/panel/client/:client_id/menus/:menu_id/submenus/store', async (ctx) => {
  const { default: SubMenusController } = await import(
    'App/Controllers/Http/SubMenusController'
  )

  return new SubMenusController().store(ctx)
});

Route.get('/panel/client/:id', async ({ params }) => {
  const { default: IndexController } = await import(
    'App/Controllers/Http/panel/IndexController'
  )
  return new IndexController().clients(params)
});

Route.get('/panel/client/:id/menus/', async ({ params }) => {
  const { default: IndexController } = await import(
    'App/Controllers/Http/panel/IndexController'
  )
  return new IndexController().menus(params)
});

Route.get('/panel/client/:client_id/menus/:menu_id/submenus', async ({ params }) => {
  const { default: IndexController } = await import(
    'App/Controllers/Http/panel/IndexController'
  )
  return new IndexController().submenus(params)
});

Route.get('/webhook/:client_id', async (ctx) => {
  const { default: MainController } = await import(
    'App/Controllers/Http/webhook/MainController'
  )

  return new MainController().index(ctx)
});

Route.post('/webhook/:client_id', async (ctx) => {
  const { default: MainController } = await import(
    'App/Controllers/Http/webhook/MainController'
  )

  return new MainController().index(ctx)
});
