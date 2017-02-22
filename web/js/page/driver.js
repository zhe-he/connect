import "../../css/driver.scss";
import Vue from 'vue';
import eventHub from 'eventHub';
import loading from 'loading';
import driverAlert from 'driverAlert';
import dataFormat from 'dataFormat'; 

const HOST = "http://139.217.24.107:8080";
const URL_GETINFO = 'http://www.wangfanwifi.com:16621/api/getinfo';
const URL_CHECK = `${HOST}/driver/mobile/check`;
const URL_SIGNIN = `${HOST}/driver/signIn`;
const URL_CODE = `${HOST}/driver/mobile/code`;
const URL_INCOME = `${HOST}/driver/driverIncome/queryIncome`;

const RETEL = /^1[3-9]\d{9}$/;

Vue.filter('ymd',(time)=>{
	return dataFormat(time,'YYYY.MM.DD');
});
window.addEventListener('DOMContentLoaded',function (){

	new Vue({
		el: '#driver',
		data: {
			tel: '',
			isLoading: false,
			code: {
				val: '',
				timer: null,
				iCount: 60,
				msg: '获取验证码'
			},
			tabNav: 0, 		// 0 -> telephone, 1 -> Verification code
			pageNav: 0, 	// 0 -> register page, 1 -> query page
			driver: {
				title: '',
				isHide: true,
				message: '',
				status: 1
			},
			connectStatus: -1, 	// -1 -> connecting, 0 ->  connection failed, 1 -> Connect successfully
			income: []
		},
		computed: {
			totalIncome(){
				let iCount = 0;
				for(let value of this.income){
					iCount+=value.total_income/1;
				}
				return iCount;
			}
		},
		created(){
			eventHub.$on('hide-alert',()=>{
				this.driver.isHide = true;
			});
		},
		mounted(){
			this.getInfo();
		},
		methods: {
			checkPhone(telephone){
				return fetch(URL_CHECK,{
					method: "POST",
					mode: "cors",
					headers:{
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: `driverMobile=${telephone}`
				}).then(response=>response.json());
			},
			signIn(telephone){
				this.isLoading = true;
				return fetch(URL_SIGNIN,{
					method: "POST",
					mode: "cors",
					headers:{
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: `driverMobile=${telephone}`
				})
					.then(response=>response.json())
					.then(data=>{
						this.isLoading = false;
						switch(data.errorCode){
							case 0:
								this.setAlert(1,'签到成功',`签到时间：${dataFormat(data.data.signTime,'YYYY年MM月DD日 hh:mm')}`);
								break;
							case 10001:
								this.setAlert(0,'很抱歉','手机号码不正确 请重新输入');
								break;
							case 10003:
								this.setAlert(1,'亲爱的司机','您当天已经签到过了');
								break;
							default:
								this.setAlert(0,'很遗憾','服务器连接不上 请重试');
								break;
						}
					});
			},
			getCode(telephone){
				return fetch(URL_CODE,{
					method: "POST",
					mode: "cors",
					headers:{
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: `driverMobile=${telephone}`
				})
					.then(response=>response.json())
					.then(data=>{
						if (data.errorCode===0) {
							this.setAlert(1,'您好','验证码发送成功 请查看短信');
						}else{
							this.setAlert(0,'很抱歉','验证码发送失败 请重试');
						}
					})
					.catch(err=>{
						console.log(`err:${err}`);
						this.setAlert(0,'很遗憾','网络连接错误 请重试');
					});
			},
			getInfo(){
				fetch(URL_GETINFO)
					.then(response=>response.json())
					.then(data=>{
						this.connectStatus = 1;
						console.log(data);
					})
					.catch(err=>{
						this.connectStatus = 0;
						console.log(`err: ${err}`);
					});
			},
			setAlert(status,title,message,isHide=false){
				this.driver = {status,title,message,isHide};
			},
			registry(){
				if (!RETEL.test(this.tel)) {
					this.setAlert(0,'很抱歉','手机号码不正确 请重试');
					return false;
				}
				switch(this.connectStatus){
					case -1:
						this.setAlert(1,'亲爱的司机','网络识别中 请稍后再试');
						return false;
					case 0:
						this.setAlert(1,'亲爱的司机','请连接往返WiFi再签到');
						return false;
				}
				this.isLoading = true;
				this.checkPhone(this.tel).then((data)=>{
					this.isLoading = false;
					switch(data.errorCode){
						case 0:
							this.signIn(this.tel).catch(err=>{
								this.isLoading = false;
								console.log(`err:${err}`);
								this.setAlert(0,'很遗憾','网络连接错误 请重试');
							});
							break;
						case 10001:
							this.setAlert(0,'很抱歉','手机号码不正确 请重新输入');
							break;
						case 10002:
							this.setAlert(0,'很遗憾','您暂时未被选中为返红利的司机，<br/>敬请期待！');
							break;
						default:
							this.setAlert(0,'很遗憾','服务器连接不上 请重试');
							break;
					}
				}).catch(err=>{
					this.isLoading = false;
					console.log(`err:${err}`);
					this.setAlert(0,'很遗憾','网络连接错误 请重试');
				});
			},
			checkIncome(){
				if (!RETEL.test(this.tel)) {
					this.setAlert(0,'很抱歉','手机号码不正确 请重新输入');
					return false;
				}
				this.tabNav = 1;
			},
			sendCode(){
				let _fn = ()=>{
					if (this.code.iCount--) {
						this.code.msg = `${this.code.iCount}s后重获取`;
					}else{
						this.code.iCount = 60;
						this.code.msg = '获取验证码';
						clearInterval(this.code.timer);
					}
				};

				if (this.code.msg != '获取验证码') {return false;}
				if (!RETEL.test(this.tel)) {
					this.setAlert(0,'很抱歉','手机号码不正确 请重新输入');
					return false;
				}
				_fn();
				this.code.timer = setInterval(_fn.bind(this),1000);
				this.getCode(this.tel);
			},
			verification(){
				if (!this.code.val) {
					this.setAlert(0,'您好','请填写验证码');
					return false;
				}
				this.isLoading = true;
				fetch(URL_INCOME,{
					method: "POST",
					mode: "cors",
					headers:{
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: `driverMobile=${this.tel}&checkCode=${this.code.val}`
				})
					.then(response=>response.json())
					.then(data=>{
						this.isLoading = false;
						if (data.errorCode===0) {
							this.pageNav = 1;
							this.income = data.data;
						}else if(data.errorCode===100) {
							this.setAlert(0,'很遗憾','服务器连接不上 请重试');
						}else{
							this.setAlert(0,'很抱歉',data.message);
						}
					})
					.catch(err=>{
						this.isLoading = false;
						console.log(`err:${err}`);
						this.setAlert(0,'很遗憾','网络连接错误 请重试');
					});
			}
		},
		components:{loading,driverAlert}
	});



},false);