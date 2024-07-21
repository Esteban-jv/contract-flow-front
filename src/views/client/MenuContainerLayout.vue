<script setup>
    import { ref, h, onBeforeMount } from 'vue'
    import { RouterLink, useRoute } from 'vue-router';
    import {
        NFlex, NLayout, NLayoutSider, NMenu, // Side menu
        NIcon
    } from 'naive-ui';
    import { Home, ListAltRegular, IdCard, Flag, GlobeAmericas, UserLock } from '@vicons/fa';
    import { i18n } from '@/plugins/i18n';

    const route = useRoute()
    const collapsed = ref(false)
    const currentRoute = ref('dashboard')
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

    onBeforeMount(() => {
        currentRoute.value = route.name
        console.log(currentRoute.value)
    })

    // METHODS
    function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
    }
</script>
<template>
    <div>
        <div>
            <NFlex vertical>
                <NLayout has-sider>
                    <NLayoutSider
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
        </div> <!-- Header -->
        <div></div> <!-- SideMenu -->
        <div></div> <!-- Footer -->
    </div>
</template>