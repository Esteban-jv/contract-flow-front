<script setup>
    import { ref, h, onBeforeMount, computed } from 'vue'
    import { RouterLink, useRoute, useRouter } from 'vue-router';
    import {
        NFlex, NLayout, NLayoutSider, NMenu, NIcon, // Sidemenu
        NSplit, NAvatar, NSwitch, NDropdown, NLayoutHeader, // Header
        NScrollbar
    } from 'naive-ui';
    import { Home, ListAltRegular, IdCard, Flag, GlobeAmericas, UserLock } from '@vicons/fa';
    import { i18n } from '@/plugins/i18n';
    import { usePreferences } from '@/stores/usePreferences';
    import ClientAuthApi from '@/api/client/ClientAuthApi';
    import Footer from '@/components/Footer.vue'
    import { useAuth } from '@/stores/useAuth';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';

    // DATA
    const { $can } = useGlobalHelpers()
    const preferences = usePreferences()
    const route = useRoute()
    const router = useRouter()
    const auth = useAuth()

    const user = ref({})
    const collapsed = ref(false)
    const currentRoute = ref('dashboard')

    // COMPUTED
    const userName = computed(() => {
      return `${user.value.first_name} ${user.value.last_name}`
    })
    const userLetters = computed(() => {
      return Array.from(user.value.first_name || '')[0] + Array.from(user.value.last_name || '')[0]
    })

    // Menu Data
    const menuOptions = ref([
      {
        label: () => h(
          RouterLink,
          {
            to: {
              name: "dashboard",
              // params: {
                // lang: "en-US"
              // }
            }
          },
          { default: () => i18n.global.t('dashboard') }
        ),
        key: "dashboard",
        icon: renderIcon(Home),
      },
      {
        label: i18n.global.t('catalog',2),
        key: "catalogs",
        icon: renderIcon(ListAltRegular),
        children: [
            {
              label: () => h(
                RouterLink,
                {
                  to: {
                    name: "languages"
                  }
                },
                { default: () => i18n.global.t('language', 2) }
              ),
              key: "languages",
              icon: renderIcon(Flag),
              disabled: !$can('view','language')
            },
            {
              label: () => h(
                RouterLink,
                {
                  to: {
                    name: "nationalities"
                  }
                },
                { default: () => i18n.global.t('nationality',2) }
              ),
              key: "nationalities",
              icon: renderIcon(GlobeAmericas),
              disabled: !$can('view','nationality')
            },
            {
              label: () => h(
                RouterLink,
                {
                  to: {
                    name: "oficial-ids"
                  }
                },
                { default: () => i18n.global.t('official_id',2) }
              ),
              key: "oficial-ids",
              icon: renderIcon(IdCard),
              disabled: !$can('view','idtype')
            },
        ]
      },
      {
          label: "Disabled link",
          key: "403",
          disabled: true,
          icon: renderIcon(UserLock),
      },
    ])
    const logout = async () => {
        await ClientAuthApi.logout()
        localStorage.removeItem('AUTH_TOKEN')
        router.push({ name: 'login' })
    }
    const userOptions = ref([
      {
        label: userName,
        key: "username",
      },
      {
        label: () => h(
          RouterLink,
          {
            to: {
              name: "dashboard",
              // params: {
                // lang: "en-US"
              // }
            }
          },
          { default: () => i18n.global.t('dashboard') }
        ),
        key: "dashboard",
      },
      {
        label: 'logout',
        key: "logout",
      }
    ])
   
    // TODO Improve this part of header
    /*const userOptions = ref([
      {
        label: () => h(
          NAvatar, {
            src: 'https://cdn4.iconfinder.com/data/icons/user-people-2/48/6-512.png'
          }
        ),
        key: 'user',
        children: [
            {
            label: userName,
            key: "username",
          },
          {
            label: () => h(
              RouterLink,
              {
                to: {
                  name: "dashboard",
                  // params: {
                    // lang: "en-US"
                  // }
                }
              },
              { default: () => i18n.global.t('dashboard') }
            ),
            key: "dashboard",
          },
          {
            label: 'logout',
            key: "logout",
          }
        ]
      },
      {
        label: () => h(
          NSwitch, {
            "v-model:value": preferences.switchTheme
          }
        ),
        key: 'theme'
      }
    ])*/
    const handleSelect = async key => {
      if(key === 'logout') {
        await logout()
      }
    }
    function renderIcon(icon) {
      return () => h(NIcon, null, { default: () => h(icon) });
    }

    // Before Mounted
    onBeforeMount(() => {
        currentRoute.value = route.name
        // console.log(currentRoute.value)

        user.value = JSON.parse(localStorage.getItem('USER'))
        // console.log(user.value)
    })
</script>
<template>
  <NLayoutHeader bordered style="height: var(--header-height);">
    <NSplit :size="0.8" class="bg-white dark:bg-black items-center">
      <template #1>
        <NMenu
          mode="horizontal"
          :options="menuOptions"
          v-model:value="currentRoute"
          responsive
        />
      </template>
      <template #2>
        <!-- <NMenu
          mode="horizontal"
          :options="userOptions"
          v-model:value="currentRoute"
          responsive
        >

        </NMenu> -->
        <NFlex justify="space-between" class="px-2">
          <NDropdown :options="userOptions" @select="handleSelect">
            <NAvatar class="my-1">{{ userLetters }}</NAvatar>
          </NDropdown>
          <NSwitch v-model:value="preferences.switchTheme" class="my-2">
            <template #icon>
              {{ preferences.theme === 'dark' ? '🌞' : '🌛' }}
            </template>
          </NSwitch>
          <select class="p-1 my-2 h-full bg-white  dark:bg-zinc-900" v-model="$i18n.locale" id="locale" @change="preferences.setLocaleInStorage()">
            <option v-for="locale in $i18n.availableLocales" :value="locale">{{ locale }}</option>
          </select>
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
                <Footer class="footer mt-auto" />
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