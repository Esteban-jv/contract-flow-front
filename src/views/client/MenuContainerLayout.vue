<script setup>
    import { ref, h, onBeforeMount, computed } from 'vue'
    import { RouterLink, useRoute, useRouter } from 'vue-router';
    import {
        NFlex, NLayout, NLayoutSider, NMenu, NIcon, // Sidemenu
        NSplit, NAvatar, NSwitch, NDropdown, NLayoutHeader // Header
    } from 'naive-ui';
    import { Home, ListAltRegular, IdCard, Flag, GlobeAmericas, UserLock } from '@vicons/fa';
    import { i18n } from '@/plugins/i18n';
    import { usePreferences } from '@/stores/usePreferences';
    import ClientAuthApi from '@/api/client/ClientAuthApi';

    // DATA
    const preferences = usePreferences()
    const route = useRoute()
    const router = useRouter()

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
              icon: renderIcon(Flag)
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
              icon: renderIcon(GlobeAmericas)
            },
            {
              label: () => h(
                RouterLink,
                {
                  to: {
                    name: "oficial-ids"
                  }
                },
                { default: () => i18n.global.t('oficial_id',2) }
              ),
              key: "oficial-ids",
              icon: renderIcon(IdCard)
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
  <NLayoutHeader bordered>
    <NSplit :size="0.8" class="bg-white dark:bg-black">
      <template #1>
        <NMenu
          mode="horizontal"
          :options="menuOptions"
          v-model:value="currentRoute"
          responsive
        />
      </template>
      <template #2>
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
  <NFlex vertical>
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
          >
              <NMenu
                  :collapsed="collapsed"
                  :collapsed-width="64"
                  :collapsed-icon-size="22"
                  :options="menuOptions"
                  v-model:value="currentRoute"
              >

              </NMenu>
          </NLayoutSider>
          <NLayout>
              <div>
                  <RouterView />
              </div>
          </NLayout>
      </NLayout>
  </NFlex>
</template>