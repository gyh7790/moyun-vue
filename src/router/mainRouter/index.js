import system from './_system'

export default {
  path: '/main',
  name: 'mainRouter',
  component: resolve => { require(['@/views/system/home/main.vue'], resolve) },
  children: [
    ...system,
    {
      path: 'mainpath',
      name: 'mainpath',
      component: resolve => { require(['@/views/modules/mainTest.vue'], resolve) }
    }]
}
