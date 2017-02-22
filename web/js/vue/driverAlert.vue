<template lang="pug">
	section(v-if="!isHide")
		.driver-mask(@click="hideAlert")
		.driver-mask-con
			i.bird
			div(:class="status==1?'success':'error'")
				p(v-text="title")
				p(v-html="message")
</template>

<style lang="sass" scoped>
	.driver-mask{
		z-index: 990;
		position: fixed;
		top: 0;
		left: 50%;
		width: 7.5rem;
		margin-left: -3.75rem;
		height: 100%;
		background-color: rgba(0,0,0,0.5);
	}
	.driver-mask-con{
		z-index: 1000;
		position: fixed;
		top: 50%;
		left: 50%;
		margin-top: -2rem;
		margin-left: -3.27rem;
		width: 6.54rem;
		height: 3.24rem;
		background-color: #fff;
		border-radius: 0.05rem;
		.bird{
			display: block;
			width: 1.32rem;
			height: 1.32rem;
			margin: -0.41rem auto 0;
			background-color: #fff;
			border-radius: 50%;
			background-repeat: no-repeat;
			background-image: url('../../images/bird.png');
			background-size: 1.04rem 0.93rem;
			background-position: center center;
		}
		p{
			text-align: center;
			&:nth-of-type(1){
				font-size: 0.4rem;
				line-height: 0.83rem;
			}
			&:nth-of-type(2){
				font-size: 0.32rem;
				line-height: 0.61rem;
				color: #4d4b4b;
			}
		}
		.success p:nth-of-type(1){
			color: #13c083;
		}
		.error p:nth-of-type(1){
			color: #ff454e;
		}
	}
		
</style>

<script type="text/javascript">
	import eventHub from 'eventHub';
	export default {
		props: {
			status: {
				type: Number | String,
				default: 1
			},
			title: {
				type: String
			},
			message: {
				type: String,
				required: true
			},
			isHide: {
				type: Boolean,
				required: true
			}
		},
		data(){
			return {
				timer: null
			}
		},
		created(){
			!this.isHide && this.setTimeHide();
		},
		watch: {
			isHide(cur){
				!cur && this.setTimeHide();
			}
		},
		methods: {
			hideAlert(){
				clearTimeout(this.timer);
				eventHub.$emit('hide-alert');
			},
			setTimeHide(time=3000){
				clearTimeout(this.timer);
				this.timer = setTimeout(()=>{
					this.hideAlert();
				},time);
			}
		}
	}
</script>