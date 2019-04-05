<template>
	<v-container grid-list-md justify-start fluid class="pa-4 ma-0">
		<div class="display-2 font-weight-thin text-sm-left">Server Environment</div>
		<template v-if="env">
			<v-chip outline disabled v-for="(value, index) of env.activeProfiles" :key="index" color="green">
				{{ value }}
			</v-chip>
		</template>
		<v-layout row>
			<v-flex d-flex>
				<v-treeview hoverable open-on-click :items="envDetails"></v-treeview>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    props: {
      actuator: Object
    },
    computed: {
      ...mapState('actuator', ['env']),

      envDetails() {
        let propertySources = [];
        let id = 0;

        if (!this.env) {
          return propertySources;
        }

        for (let propertySource of this.env.propertySources) {
          let value = {
            id: id++,
            name: propertySource.name,
            children: []
          };

          Object.keys(propertySource.properties).forEach((property) => {
            value.children.push({
              id: id++,
              name: property,
              children: [{id: id++, name: propertySource.properties[property].value}]
            });
          });

          propertySources.push(value);
        }

        return propertySources;
      }
    }
  }
</script>