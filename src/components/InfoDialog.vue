<template>
	<v-layout row justify-center>
		<v-dialog dark v-model="dialogData.show" max-width="290">
			<v-card>
				<v-card-title class="headline">{{ dialogData.title }}</v-card-title>
				<v-card-text>{{ dialogData.description }}</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" flat v-for="(button, index) in dialogData.buttons" :key="index" @click="$emit(button.id)">{{ button.text }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-layout>
</template>

<script>
  export default {
    props: {
      dialogData: Object
    }
  }
</script>