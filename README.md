# 0. Getting Started

```bash
$ npm install

$ npm run dev
```

### prisma studio

```bash
$ npx prisma studio
```

### Architecture

<img width="942" height="585" alt="스크린샷 2026-03-22 오후 5 18 02" src="https://github.com/user-attachments/assets/6ebd5d41-17b9-411c-a910-c7d99f10c841" />

### [👉 Swagger 링크](https://chefgpt-back.vercel.app/)

<br/>
<br/>

# 1. Project Overview

### 프로젝트 이름: ChefGPT

ChefGPT는 유튜브 영상 속 레시피를 텍스트 데이터로 변환하여  
영상에 의존하지 않고도 레시피를 쉽게 확인하고 활용할 수 있도록 만든 플랫폼입니다.

기존의 영상 기반 레시피는 필요한 정보를 빠르게 찾기 어렵다는 문제를 해결하고자 했습니다.

또한 단순한 레시피 저장을 넘어,  
사용자의 냉장고 데이터를 기반으로 한 레시피 추천과  
요리 투표 및 정보 공유 기능을 통해 커뮤니티 경험까지 제공합니다.

<br/>
<br/>

# 2. Tech Stack

### Server:

<table>
  <tr>
    <td align="center">
      <img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/nest_js.png" />
      <br/>
      <sub><b>NestJs</b></sub>
    </td>
    <td align="center">
      <img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/prisma.png" />
      <br/>
      <sub><b>Prisma</b></sub>
    </td>
    <td align="center">
      <img width="50" src="https://simpleicons.org/icons/passport.svg" />
      <br/>
      <sub><b>PassPort</b></sub>
    </td>
  </tr>
</table>

<br/>

### DB & Storage:

<table>
  <tr>
    <td align="center">
      <img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/postgresql.png" />
      <br/>
      <sub><b>PostgreSQL</b></sub>
    </td>
    <td align="center">
      <img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/supabase.png" />
      <br/>
      <sub><b>Supabase</b></sub>
    </td>
  </tr>
</table>

<br/>
<br/>
<br/>

# 3. Key Features

- ### **🔐 인증**:
  - 로컬스토리지와, JWT를 통한 인증기능
  - Passport + Strategy + Guard 조합
  - `jwt.strategy`: 토큰 검증
  - `local.strategy`: 로그인 처리
  - `jwt-auth.guard`: 인증 보호
  - `decorator`: 현재 사용자 추출

- ### **🎬 유튜브 레시피 데이터 처리**:
  - 유튜브 자막 데이터 수집 및 정제
  - 비정형 텍스트를 구조화된 레시피 데이터로 변환
  - 레시피 저장 및 조회 API 제공
  - 유튜브자막 전용 서버에 요청 후 로직 처리 ([유튜브서버 깃허브 링크](https://github.com/cokid1998/youtube-transcript))

- ### **✍️ 레시피 관리**:
  - 레시피 생성, 수정, 삭제 API 제공
  - 사용자별 레시피 데이터 관리

- ### **🧊 식재료 관리 시스템**:
  - 사용자 보유 식재료 CRUD API 제공
  - 사용자별 냉장고 데이터 관리

- ### **🤖 레시피 추천 로직**:
  - 사용자 식재료 기반 레시피 필터링 및 추천
  - 조건 기반 데이터 조회 로직 구현

- ### **🗳️ 투표 시스템**:
  - 투표 생성, 참여, 결과 조회 API 제공
  - 사용자 참여 기반 데이터 집계 처리

- ### **📚 요리 정보 관리**:
  - 에디터 기반 콘텐츠 CRUD API 제공
  - 게시글 조회 및 리스트 API 구현

- ### **👤 사용자 정보 관리**:
  - 사용자 프로필 및 활동 데이터 조회
  - 사용자 작성 콘텐츠 통합 조회 API 제공

<br/>
<br/>
<br/>

# 4. 📁 Project Structure

```
src
├── assets        # 이미지 및 정적 파일
├── components    # 도메인별 컴포넌트
│   ├── article       # 요리정보 컴포넌트
│   ├── recipe        # 레시피 컴포넌트
│   ├── refrigerator  # 내 냉장고 컴포넌트
│   ├── vote          # 투표 기능 컴포넌트
│   ├── myInfo        # 내 정보 컴포넌트
│   ├── modal         # 모달 컴포넌트
│   ├── layout        # 레이아웃 구성
│   ├── common        # 공통 컴포넌트
│   └── ui            # Shadcn 컴포넌트
│
├── hooks
│   ├── API           # API 요청 로직 (React Query 기반)
│   │   ├── GET / POST / PATCH / DELETE 단위로 분리
│   │   └── 도메인별 (article, recipe, vote 등) 구성
│   └── custom hooks  # 공통 훅 (스크롤, 모바일 감지 등)
│
├── constants         # API URL, Query Key 등 상수 관리
├── store             # 전역 상태 관리 (인증, 모달)
├── provider          # 모달 Provider
├── types             # 프로젝트에서 사용하는 타입
├── page              # 라우팅되는 페이지
├── lib               # Shadcn 컴포넌트에서 사용하는 유틸함수
│
├── App.tsx
├── route.tsx         # 라우팅 설정
└── main.tsx          # 엔트리 포인트
```
