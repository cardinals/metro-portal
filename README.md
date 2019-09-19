# 大数据门户系统 oa-bdps/metro-portal-web

## 开发环境
### 安装依赖
```
yarn
```
### 运行开发环境
```
yarn serve
```
注：如果无法访问到有效数据，需要检查数据接口的状态。

## 构建
### Docker镜像
#### 安装依赖
```
yarn
```
#### 构建镜像
```
yarn build-image
```

#### 修改镜像tag
```
docker tag 192.168.93.172/oa-bdps/metro-portal-web:latest 192.168.93.172/oa-bdps/metro-portal-web:<版本号>
```

#### 将镜像启动为容器
```
docker run --name=metro-portal-web --restart=always -d -p <前端Port>:80 -e LOCATION='\/portal' -e PROXY_PASS='http:\/\/<接口IP>:<接口Port>' 192.168.93.172/oa-bdps/metro-portal-web:<版本号>
```
注：目前部署环境的启动命令
```
docker run --name=metro-portal-web --restart=always -d -p 9008:80 -e LOCATION='\/portal' -e PROXY_PASS='http:\/\/192.168.93.70:8788' 192.168.93.172/oa-bdps/metro-portal-web:latest
```
