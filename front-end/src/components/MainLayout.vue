

<script setup>
import {ref} from 'vue'
import Notifications from "./Notifications.vue";
import useDarkMode from "@/composeables/darkMode.js";

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

const {isDark} = useDarkMode();

const searchText = ref('');

</script>

<template>
  <q-layout view="lHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>

        <q-input rounded outlined
                 bg-color="white"
                 v-model="searchText"
                 label="Search"
                 dense
                 class="q-ml-md q-mt-xs q-mb-xs"

        >
          <template v-slot:prepend>
            <q-icon name="search" color="orange"/>
          </template>
        </q-input>
        <q-space/>
        <q-btn

            round
            :icon="isDark ? 'dark_mode' : 'light_mode'"
            @click="isDark = !isDark"
            class="q-mr-md"
        >
          <q-tooltip>Switch to {{ isDark ? 'light' : 'dark' }} mode</q-tooltip>
        </q-btn>
        <notifications/>
        <div class="q-mr-md">Daniella</div>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar6.jpg"
               alt="Quasar Logo"
          />
        </q-avatar>
        <q-btn
            round
            icon="keyboard_arrow_down"
        >
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Open...</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>New</q-item-section>
              </q-item>
              <q-separator/>
              <q-item clickable>
                <q-item-section>Preferences</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right"/>
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                  <q-list>
                    <q-item
                        v-for="n in 3"
                        :key="n"
                        dense
                        clickable
                    >
                      <q-item-section>Submenu Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right"/>
                      </q-item-section>
                      <q-menu auto-close anchor="top end" self="top start">
                        <q-list>
                          <q-item
                              v-for="n in 3"
                              :key="n"
                              dense
                              clickable
                          >
                            <q-item-section>3rd level Label</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>

              </q-item>
              <q-separator/>
              <q-item clickable v-close-popup>
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>

        </q-btn>

        <!--        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />-->
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <!--    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>-->
    <!--      &lt;!&ndash; drawer content &ndash;&gt;-->
    <!--    </q-drawer>-->

    <q-page-container>
      <router-view/>
    </q-page-container>


  </q-layout>
</template>