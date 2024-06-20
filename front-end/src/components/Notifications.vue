<script setup>
import {useMessageStore} from "@/stores/messageStore.js";
import {storeToRefs} from "pinia";

const mainStore = useMessageStore();
const {notifications, getNumberOfNotifications} = storeToRefs(mainStore);
</script>

<template>
  <q-btn dense color="purple" round icon="notifications" class="q-ml-md q-mr-xs">
    <q-badge :color="getNumberOfNotifications ? 'red' : 'blue-10'"
             floating>{{
        getNumberOfNotifications
      }}
    </q-badge>
    <q-menu>
      <q-list>
        <q-item
            v-for="notification in notifications.filter(n => !n.read)"
            :key="notification.id"
            clickable
            @click="mainStore.markRead(notification.id)"
        >
          <q-item-section>{{ notification.title }}</q-item-section>
          <q-item-section side>{{ notification.date }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
