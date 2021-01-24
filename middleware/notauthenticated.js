/**
 * 中间件需要导出一个方法，方法接收一个context参数
 */
export default function({ store, redirect}){
    if(store.state.user){
        redirect('/');
    }
}