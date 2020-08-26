@Controller
@RequestMapping({
  path: '/user',
  method: 'GET',
  consumes: 'application/json',
  accept: 'application/json;charset=utf-8',
})
class A {
  @RequestMapping({
    path: '/{userID}',
    method: 'GET',
    consumes: 'application/json',
    accept: 'application/json;charset=utf-8',
  })
  user(@PathVariable('ownerId')) {}
}
