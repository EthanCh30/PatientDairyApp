from wxauto import WeChat
import time
wx = WeChat()

# 发送消息
who = 'LongxiaoChen'
for i in range(1000):
    wx.SendMsg(f'hello', who)
    time.sleep(10)
print('wxauto测试完成！')
