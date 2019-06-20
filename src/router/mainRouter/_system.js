export default [
  {
    path: 'sys/menu',
    name: 'sys-menu',
    title: '菜单管理',
    component: resolve => { require(['@/views/system/sys/menu.vue'], resolve) }
  },
  {
    path: 'sys/user',
    name: 'sys-user',
    title: '用户管理',
    component: resolve => { require(['@/views/system/sys/user.vue'], resolve) }
  },
  {
    path: 'sys/role',
    name: 'sys-role',
    title: '角色管理',
    component: resolve => { require(['@/views/system/sys/role.vue'], resolve) }
  },
  {
    path: 'sys/dept',
    name: 'sys-dept',
    title: '部门管理',
    component: resolve => { require(['@/views/system/sys/dept.vue'], resolve) }
  },
  {
    path: 'sys/dict',
    name: 'sys-dict',
    title: '字典管理',
    component: resolve => { require(['@/views/system/sys/dict.vue'], resolve) }
  },
  {
    path: 'gen/table',
    name: 'gen-table',
    title: '业务表配置',
    component: resolve => { require(['@/views/system/gen/table/table.vue'], resolve) }
  },
  {
    path: 'job/quartz',
    name: 'job-quartz',
    title: '业务表配置',
    component: resolve => { require(['@/views/system/job/quartz.vue'], resolve) }
  }
]
