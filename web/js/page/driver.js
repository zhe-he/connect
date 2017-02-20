import "../../css/driver.scss";
import Vue from 'vue';
import loading from 'loading';

const GETINFO = 'http://www.wangfanwifi.com:16621/api/getinfo';

new Vue({
	el: '#driver',
	data: {
		tel: '',
		isInTheCar: false
	},
	computed: {
		
	},
	watch: {
		tel(cur){
			let reTel = /^1[3-9]\d{9}$/;
		}
	},
	mounted(){
		this.getInfo();
	},
	methods: {
		getInfo(){
			fetch(GETINFO,{timeout: 5000}) 	// a feature that's not in the spec (timeout)
				.then(response=>{
					response.json();
				})
				.then(data=>{
					this.isInTheCar = true;
					console.log(data);
				})
				.catch(err=>{
					console.log(`err: ${err}`);
				});
		}
	},
	components:{loading}
});

