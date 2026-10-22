# 개발 환경 설치

처음 실행하는 경우 운영체제에 맞게 Java 17과 Node.js 22를 설치하세요. 이미 Java 17 이상과 Node.js 22.12 이상이 설치되어 있으면 버전을 확인하고 실행 단계로 넘어가면 됩니다. npm은 Node.js에 포함되어 있으며, Maven과 DB를 따로 설치할 필요는 없습니다.

## macOS

기본 셸인 zsh 기준입니다.

### 1. Homebrew 확인

```sh
brew --version
```

brew 명령을 찾을 수 없다면 [Homebrew 공식 설치 방법](https://docs.brew.sh/Installation)에 따라 실행합니다.

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치 마지막에 표시되는 **Next steps**의 명령을 실행해 Homebrew를 PATH에 등록하세요. Apple Silicon과 Intel Mac은 설치 경로가 다르므로 설치 프로그램이 출력한 명령을 사용합니다. 그다음 터미널을 다시 열어 `brew --version`을 확인합니다.

### 2. Java와 Node.js 설치

```sh
brew install --cask temurin@17
brew install node@22
```

공식 패키지: [Java 17](https://formulae.brew.sh/cask/temurin@17), [Node.js 22](https://formulae.brew.sh/formula/node@22).

### 3. 실행 경로 설정

Node.js 22는 Homebrew의 별도 버전 패키지이므로 PATH를 등록합니다. 다음 명령은 처음 한 번 실행하세요.

```sh
printf '%s\n' \
  'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' \
  'export PATH="$JAVA_HOME/bin:$(brew --prefix node@22)/bin:$PATH"' \
  >> ~/.zshrc
source ~/.zshrc
```

### 4. 버전 확인

```sh
java -version
javac -version
node --version
npm --version
```

이 안내대로 설치했다면 Java와 javac은 17, Node.js는 v22.12 이상이어야 합니다. npm도 버전 숫자가 출력되어야 합니다.

## Windows 10 / 11

PowerShell에서 실행합니다.

### 1. WinGet 확인

```powershell
winget --version
```

명령을 찾을 수 없다면 Microsoft Store에서 [앱 설치 관리자](https://apps.microsoft.com/detail/9nblggh4nns1)를 설치하거나 업데이트한 뒤 PowerShell을 다시 여세요. [Microsoft 공식 안내](https://learn.microsoft.com/en-us/windows/package-manager/winget/).

### 2. Java와 Node.js 설치

```powershell
winget install --exact --id EclipseAdoptium.Temurin.17.JDK --source winget
winget install --exact --id OpenJS.NodeJS.22 --source winget
```

공식 패키지 목록: [Java 17](https://github.com/microsoft/winget-pkgs/tree/master/manifests/e/EclipseAdoptium/Temurin/17/JDK), [Node.js 22](https://github.com/microsoft/winget-pkgs/tree/master/manifests/o/OpenJS/NodeJS/22).

설치가 끝나면 PowerShell을 닫고 다시 여세요. VS Code나 IntelliJ 안의 터미널을 사용한다면 해당 프로그램도 다시 실행하세요.

### 3. 버전 확인

```powershell
java -version
javac -version
node --version
npm.cmd --version
```

Java와 javac은 17, Node.js는 v22.12 이상이어야 합니다. npm도 버전 숫자가 출력되어야 합니다. Windows 안내에서는 PowerShell 스크립트 실행 정책에 영향을 받지 않는 `npm.cmd`를 사용합니다.

## 로컬 실행

아래 경로는 저장소를 클론한 폴더 기준입니다. 백엔드와 프론트엔드는 **각각 별도의 터미널**에서 실행하고, 두 터미널을 모두 열어두세요. 처음 실행할 때는 의존성 다운로드를 위해 인터넷 연결이 필요합니다.

### macOS

터미널 1, 저장소 루트에서:

```sh
cd backend
./mvnw spring-boot:run
```

터미널 2, 저장소 루트에서:

```sh
cd frontend
npm ci
npm run dev
```

### Windows PowerShell

터미널 1, 저장소 루트에서:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

터미널 2, 저장소 루트에서:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

브라우저에서 **http://localhost:5173**에 접속하세요. 백엔드는 http://localhost:8080에서 실행됩니다. 로컬 데이터는 배포 서버와 별개이며, 기본 메모리 DB에서는 백엔드를 재시작하면 초기 상태로 돌아갑니다.
