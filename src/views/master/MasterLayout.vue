<script setup>
    import { ref, h, onBeforeMount, computed } from 'vue'
    import { RouterLink, useRoute, useRouter } from 'vue-router';
    import {
        NFlex, NLayout, NLayoutSider, NMenu, NIcon, // Sidemenu
        NSplit, NAvatar, NDropdown, NLayoutHeader, NText, // Header
        NScrollbar
    } from 'naive-ui';
    import { Home, ListAltRegular, IdCard, Flag, GlobeAmericas, UserClock, UserFriends, UserTag, UserPlus, UsersCog, UserCheck,
      MoneyBill, MoneyBillWave, ExchangeAlt, ConciergeBell, Cog, UserTie, BlackTie
     } from '@vicons/fa';
    import { usePreferences } from '@/stores/usePreferences';
    import MasterApi from '@/api/master/MasterApi';
    import Footer from '@/components/Footer.vue'
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { i18n } from '@/plugins/i18n';

    // DATA
    const { $can, $t } = useGlobalHelpers()
    const preferences = usePreferences()
    const route = useRoute()
    const router = useRouter()

    const user = ref({})
    const collapsed = ref(false)
    const currentRoute = ref('master')

    // COMPUTED
    const userName = computed(() => {
      return `${user.value.first_name} ${user.value.last_name}`
    })
    const userLetters = computed(() => {
      return Array.from(user.value.first_name || '')[0] + Array.from(user.value.last_name || '')[0]
    })
    const avatar = computed(() => {
      return user.profile_picture ? 
      h(NAvatar, {
        round: true,
        style: "margin-right: 12px;",
        src: user.profile_picture,
        fallbackSrc: "https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG"
      })
        :
      h(NAvatar, {
        round: true,
        style: "margin-right: 12px;",
        class: "bg-green-400 dark:bg-green-800",
        },
        { default: () => userLetters.value })
    })

    // Menu Data
    const menuOptions = ref([])
    const logout = async () => {
        await MasterApi.logout()
        localStorage.removeItem('AUTH_TOKEN')
        localStorage.removeItem('USER')
        localStorage.removeItem('P')
        router.push({ name: 'login' })
    }
    function renderCustomHeader() {
      return h(
        "div", { style: "display: flex; align-items: center; padding: 8px 12px;" },
        [
          avatar.value,
          h("div", null, [
            h("div", null, [ h(NText, { depth: 2 }, { default: () => userName.value }) ]),
            h("div", { style: "font-size: 12px;" }, [ h(NText, { depth: 3 }, { default: () => `${user.value.username}` }) ])
          ])
        ]
      );
    }
    const userOptions = ref([
      {
        key: "header",
        type: "render",
        render: renderCustomHeader
      },
      {
        key: "header-divider",
        type: "divider"
      },
      {
        label: $t('theme'),
        children: [
          {
            label: 'light',
            key: 'light',
          },
          {
            label: 'dark',
            key: 'dark',
          }
        ],
        key: 'theme'
      },
      {
        label: i18n.global.locale || 'xdd',
        children : i18n.global.availableLocales.map( locale => {
          return {
            label: locale,
            key: locale,
          }
        }),
        key: "settings",
      },
      {
        label: 'logout',
        key: "logout",
      }
    ])

    const headerOptions = ref([
      {
        label: () => h(
          RouterLink,
          {
            to: {
              name: "master",
              // params: {
                // lang: "en-US"
              // }
            }
          },
          { default: () => $t('master') }
        ),
        key: "master",
      },
    ])

    // Handle User Options
    const handleSelect = async key => {
      const { availableLocales } = i18n.global
      // console.warn(key, availableLocales)
      switch (key) {
        case 'logout':
          await logout()
          break;
        case 'light':
          console.log('light')
          preferences.theme = 'light'
          preferences.switchTheme = false
          break;
        case 'dark':
          console.log('dark')
          preferences.theme = 'dark'
          preferences.switchTheme = true
          break;
        default:
          if (availableLocales.includes(key)) {
            i18n.global.locale.value = key
            preferences.setLocaleInStorage()
          }
          break;
      }
    }
    function renderIcon(icon) {
      return () => h(NIcon, null, { default: () => h(icon) });
    }
    const buildModule = (module, parentChildren = null) => {
    // extraer variables
    const { icon, singular, plural, permissions, children } = module

    // Verificar todos los permisos del array
    permissions.forEach(cp => {
      cp.allow = true
    });

    // Verificar si al menos un permiso está concedido
    if (permissions.some(cp => cp.allow === true)) {
      let cat_children = []

      // Agregar solo RouterLink concedidos
      permissions.forEach(cp => {
        if (cp.allow) {
          cat_children.push({
            label: () => h(
              RouterLink,
              {
                to: {
                  name: cp.path
                }
              },
              { default: () => $t(cp.name, 2) }
            ),
            key: cp.path,
            icon: renderIcon(cp.icon),
            children: null
          })
        }
      })

      // Procesar hijos recursivamente si existen
      if (children && Array.isArray(children)) {
        children.forEach(childModule => {
          buildModule(childModule, cat_children)
        })
      }

      // Renderizar todos los RouterLinks en el objeto de menú actual
      const menuItem = {
        label: $t(singular, 2),
        key: plural,
        icon: renderIcon(icon),
        children: cat_children
      }

      if (parentChildren) {
        parentChildren.push(menuItem)
      } else {
        menuOptions.value.push(menuItem)
      }
    }
  }
    function buildMenu() {
      menuOptions.value = []
      menuOptions.value.push({
        label: () => h(
          RouterLink,
          { to: { name: "master" } },
          { default: () => $t('master') }
        ),
        key: "master",
        icon: renderIcon(Home),
      })

    }

    // Before Mounted
    onBeforeMount(() => {
        currentRoute.value = route.name
        // console.log(currentRoute.value)

        user.value = JSON.parse(localStorage.getItem('USER'))
        // console.log(user.value)
        buildMenu()
    })
</script>
<template>
  <NLayoutHeader bordered style="height: var(--header-height);">
    <NSplit :size="0.8" class="bg-white dark:bg-black items-center">
      <template #1>
        <NMenu
          mode="horizontal"
          :options="headerOptions"
          v-model:value="currentRoute"
          responsive
        />
      </template>
      <template #2>
        <NFlex justify="end" class="px-2">
          <NDropdown :options="userOptions" @select="handleSelect" trigger="click">
            <NAvatar class="my-1">{{ userLetters }}</NAvatar>
          </NDropdown>
        </NFlex>
      </template>
    </NSplit>
  </NLayoutHeader>
  <NFlex vertical class="h-full">
      <NLayout has-sider>
          <NLayoutSider
              class="bg-slate-50  dark:bg-zinc-900"
              bordered
              collapse-mode="width"
              :collapsed-width="64"
              :width="240"
              :collapsed="collapsed"
              show-trigger
              @collapse="collapsed = true"
              @expand="collapsed = false"
              style="margin-bottom: 7px"
          >
            <NScrollbar class="h-full">
              <NMenu
                  :collapsed="collapsed"
                  :collapsed-width="64"
                  :collapsed-icon-size="22"
                  :options="menuOptions"
                  v-model:value="currentRoute"
              >

              </NMenu>
            </NScrollbar>
          </NLayoutSider>
          <NLayout position="static" style="height: calc(100vh - var(--header-height) + 7px);">
              <NScrollbar class="document-scroll-container" content-style="min-height: calc(100vh - var(--header-height)); display: flex; flex-direction: column;">
                <div class="p-5">
                  <div class="w-full h-full">
                    <RouterView />
                  </div>
                </div>
                <!-- <Footer class="footer mt-auto" /> -->
              </NScrollbar>
          </NLayout>
      </NLayout>
  </NFlex>
</template>
<style>
  aside {
    height: calc(100vh - var(--header-height))!important;
  }
</style>