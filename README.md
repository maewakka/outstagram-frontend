## Outstagram Frontend
아웃스타그램 프론트엔드

### 개발 환경
- **React** : 18.2.0
- **Node** : 22.4.0
- **ETC** : Bootstrap, Axios, Redux, Stompjs

### 프로젝트 구조
```
outstagram-frontend/
└── src/
    ├── components/
    ├── pages/
    └── redux/
```

#### `components`
이 패키지는 어플리케이션에서 사용하는 axios 관련 js들을 포함합니다.

#### `pages`
이 패키지는 어플리케이션에서 사용하는 리액트 컴포넌트 관련 js들과 css를 포함합니다.

#### `redux`
이 패키지는 어플리케이션에서 사용하는 redux 관련 js들을 포함합니다.

### 배포
1. npm 으로 해당 프로젝트를 빌드한다.
```
npm run build
```
2. 빌드로 나온 결과물을 Nginx 서버로 옮겨준다.
```
scp -r build nginx:~/nginx/html/
```
3. nginx 서버를 재시작 하여준다.
```
sudo systemctl restart nginx
```