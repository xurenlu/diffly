const realNotify = (title, body) => {
    const notification = new Notification(title,{
        body: body
    });
}
export default function notify(title,body){
    // 首先，我们需要检查浏览器是否支持通知
    if (!("Notification" in window)) {
        console.log("这个浏览器不支持桌面通知");
    }

// 接着，我们需要检查用户是否给予了通知权限
    else if (Notification.permission === "granted") {
        // 如果用户已经同意了，那么我们就可以创建一个通知
       realNotify(title,body)
    }

// 否则，我们需要向用户请求权限
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
            // 如果用户接受了我们的请求，我们就可以创建一个通知
            if (permission === "granted") {
                realNotify(title,body)
            }
        })
    }
}

