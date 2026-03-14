import"./DsnmJJEf.js";import"./C45jvL7c.js";import{s as e,f as k,a as S,d as D,R as h,t as w,h as m,r as v}from"./iMfcFU0B.js";import{h as s}from"./Dd_SryOY.js";import{s as b}from"./Bkl7YH3D.js";const P={title:"폴더 구조는 하나의 사고방식이다",description:"아키텍처는 의존성 방향을 알려주지만, 폴더를 어떻게 나눌지는 알려주지 않습니다. 그 공백을 어떻게 채울지 고민한 이야기입니다.",date:"LONG_AGO",order:2,tags:["architecture","backend","typescript","folder-structure"],coverColor:"#B5D8E8",published:!0},{title:M,description:j,date:B,order:G,tags:N,coverColor:E,published:z}=P;var A=D('<p>프로젝트 폴더 구조에 대해 진지하게 고민해본 적이 있나요? 이 글은 웹 개발을 주제로 합니다. 굳이 구분하자면 백엔드에 가깝지만, 독립적인 프로젝트로 개발하는 현대 프론트엔드라면 이야기는 크게 다르지 않습니다.</p> <p>개발자들은 코드의 품질을 높이기 위해 객체지향 설계 기법과 디자인 패턴을 고민합니다. 그런데 의외로 폴더 구조에 대해서는 좋은 코드를 작성하는 방법만큼이나 깊은 논의가 없습니다. 코드가 전자 부품이라면, 프로젝트 폴더 구조는 회로 설계입니다. 부품이 아무리 정밀해도 회로가 뒤엉켜 있으면 전류는 엉뚱한 곳으로 흐릅니다. 코드도 마찬가지입니다. 개별 코드의 품질이 아무리 좋더라도, 폴더 구조와 참조 방향이 뒤엉켜 있으면 프로젝트 전체가 길을 잃습니다.</p> <p>코드는 결국 파일 안에 담기고, 파일은 관심사에 따라 폴더로 묶입니다. 그렇다면 그 폴더를, 그리고 폴더 간의 참조 방향을 어떤 기준으로 설계해야 할까요?</p> <h2 id="계층layer-기준으로-나누기"><a href="#계층layer-기준으로-나누기">계층(Layer) 기준으로 나누기</a></h2> <p>가장 먼저 접하는 방식은 애플리케이션 아키텍처를 기준으로 폴더를 나누는 것입니다. 레이어드 아키텍처에서 각 계층은 명확한 역할을 가지며, 그 역할에 따라 폴더가 구성됩니다.</p> <table><thead><tr><th>레이어</th><th>역할</th><th>폴더 예시</th></tr></thead><tbody><tr><td>Presentation Layer</td><td>HTTP 요청 처리, 응답 반환</td><td><code>controller/</code></td></tr><tr><td>Application Layer</td><td>비즈니스 로직 조율</td><td><code>service/</code></td></tr><tr><td>Persistence Layer</td><td>데이터 저장 및 조회</td><td><code>repository/</code></td></tr></tbody></table> <p>레이어드 아키텍처 자체가 이런 물리적 구조를 강제하는 건 아닙니다. 하지만 계층 간 단방향 흐름이라는 명확한 원칙이 있기 때문에 느낌대로 구성해도 처음에는 문제가 없습니다. 구성이 쉽고, 코드의 큰 흐름이 눈에 보입니다.</p> <!> <p>하지만 프로젝트가 커지면 단점이 드러나기 시작합니다.</p> <p>도메인에 관련된 코드들이 여러 폴더에 파편화되고 유저 관련 코드를 수정하려면 <code>controller/</code>, <code>service/</code>, <code>repository/</code>, <code>dto/</code> 등을 전부 돌아다녀야 해요. 이건 이 구조에서 어찌 보면 당연한 단점입니다.</p> <p>진짜 문제는 같은 레이어 안에서 생깁니다. <code>service</code> 폴더 안에서도 여러 서비스를 조율하는 오케스트레이션 서비스와, 단일 업무를 담당하는 서비스는 성격이 다릅니다. 하지만 같은 폴더 안에 나란히 놓여 있어요. 같은 레이어 안에서 서로를 참조하는 순간, 뭔가 찜찜한 느낌이 듭니다. 뭐가 상위이고 뭐가 하위인지, 방향이 흐려지는 거죠.</p> <!> <p>DTO에서는 이 문제가 더 두드러집니다. DTO는 <code>controller</code>, <code>service</code>, <code>repository</code> 어디서든 가져다 쓸 수 있는 공용 폴더의 성격을 가지면서도, 본질적으로는 특정 도메인에 응집되어야 합니다. 가장 많이 생성되는 파일 유형임에도 불구하고, 유형 기준으로만 묶어두면 도메인별 하위 분류 없이는 파일을 찾는 것조차 힘들어집니다. 게다가 요청에서 들어온 DTO가 흐름의 끝까지 그대로 쓰인다는 보장도 없습니다. 각 레이어에서 가공한 DTO가 생길 수 있고, 그걸 나누는 기준은 점점 모호해집니다.</p> <h2 id="기능feature-기준으로-나누기"><a href="#기능feature-기준으로-나누기">기능(Feature) 기준으로 나누기</a></h2> <p>계층이 아니라 기능(feature) 단위로 폴더를 나누는 접근도 있습니다. NestJS를 접해보면, 프레임워크가 이 방향을 권장하고 있다는 걸 알 수 있어요. <code>user/</code>, <code>post/</code>, <code>auth/</code> 처럼 각 기능의 폴더가 자신에게 필요한 controller, service, repository, dto등을 모두 품고 있는 구조입니다.</p> <p>도메인 응집도는 확실히 높아집니다. 유저 관련 코드를 수정할 때 <code>user/</code> 하나만 보면 되니까요. 하지만 이 방식은 기능들이 서로 협력하는 상황에서는 불리합니다.</p> <p>각 기능이 프로세스 안에서 독립적으로 돌아가면 좋겠지만, 현실은 다릅니다. <code>UserService</code>가 <code>PostService</code>를 참조하거나, 한 도메인의 모델이 다른 도메인의 모델을 참조하는 일은 흔합니다. 어떤 서비스가 다른 기능의 repository를 직접 참조하는 경우도 있습니다. 이런게 괜찮은 건지 찜찜해 하면서도, 스스로 규칙을 만들어 일단은 허용합니다.</p> <!> <p>계층형 구조는 명확한 수직적 레이어를 통해 역할과 책임을 분리하지만, 기능형 구조는 기능 내부의 응집에만 몰입한 나머지 도메인 간 경계를 넘나드는 상호작용이 발생할 때 이를 제어할 표준 가이드라인이 없어 아키텍처가 비대칭적으로 변질됩니다.</p> <h2 id="클린-아키텍처는-답인가"><a href="#클린-아키텍처는-답인가">클린 아키텍처는 답인가?</a></h2> <p>우리는 이런 문제가 발생하면 일단 클린 아키텍처를 찾습니다. 과연 클린아키텍처는 우리가 마주한 이 구조적인 찜찜함을 해결해 줄, 정말 좋은 대안이 될 수 있을까요?</p> <div class="markdown-alert markdown-alert-important"><p class="markdown-alert-title"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Important</p> <p><strong>클린 아키텍처의 본래 목적은 폴더 구조가 아닙니다.</strong> 핵심은 도메인 영역의 순수성입니다. 비즈니스 규칙과 유즈케이스가 외부 세부사항 — 프레임워크, 데이터베이스, UI, 외부 서비스 — 에 의존하지 않도록 설계하는 것이에요. 이 원칙을 어떻게 폴더로 표현할 것인가는 전적으로 해석의 영역입니다.</p></div> <p>로버트 마틴의 <a href="https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html" rel="noopener noreferrer" target="_blank">원문</a>을 다시 한번 살펴보면 흥미로운 점이 있습니다.</p> <p><img src="https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg" alt="클린 아키텍처 다이어그램"/></p> <p>이 유명한 동심원 다이어그램은 <strong>의존성 방향의 원칙</strong>을 설명해요. 바깥 원은 안쪽 원을 참조할 수 있지만, 안쪽 원은 바깥을 몰라야 한다는 거죠. 원칙 자체는 명확합니다. 하지만 원문 어디에도 프로젝트의 폴더를 어떻게 나눠야 하는지, 폴더 안에 코드를 어떻게 배치해야 하는지는 언급되지 않아요. 이 부분은 전적으로 개발자의 해석에 맡겨져 있습니다.</p> <p>그래서인지 같은 클린 아키텍처를 표방하면서도 프로젝트마다 폴더 구조가 제각각이에요. 해석이 다양한 것 자체가 나쁜 건 아니에요. 다만 한 가지 점검해볼 건 있습니다 — 그 해석으로 만들어진 폴더 구조가 일관된 규칙이 지켜지고 있는지요.</p> <p>코드간의 의존 방향만큼 중요한 것이 폴더간의 의존 방향입니다. 폴더 간에 양방향 참조가 존재하거나, 같은 레벨의 폴더가 서로를 참조하고 있다면 — 그 이유를 명확하게 설명할 수 있어야 해요.</p> <h2 id="구조를-해석하는-능력을-기르기"><a href="#구조를-해석하는-능력을-기르기">구조를 해석하는 능력을 기르기</a></h2> <p>의미 있는 폴더 이름을 짓는 것도 중요합니다. 하지만 더 근본적인 질문이 있어요.</p> <p><strong>파일들이 어떤 기준으로 분류되고 있는가, 그리고 그 폴더들 사이의 참조 방향이 일관성 있게 유지되고 있는가.</strong></p> <p>이 두 가지를 명확하게 대답할 수 없다면, 폴더 이름이 아무리 직관적이어도 구조는 결국 흔들립니다.</p> <p>저는 이 문제의 정답을 <a href="https://feature-sliced.design/kr/docs/get-started/overview" rel="noopener noreferrer" target="_blank">FSD(Feature-Sliced Design)</a>에서 찾았습니다.</p> <p><img src="https://feature-sliced.design/kr/assets/images/visual_schema-e826067f573946613dcdc76e3f585082.jpg" alt="FSD 구조 개요"/></p> <p>FSD는 프론트엔드 아키텍처 방법론입니다. FSD는 폴더를 세 가지 단위로 구분합니다.</p> <table><thead><tr><th>단위</th><th>설명</th><th>예시</th></tr></thead><tbody><tr><td><strong>레이어(Layer)</strong></td><td>최상위 폴더. 전체 구조의 계층을 나눈다</td><td><code>app/</code>, <code>features/</code>, <code>shared/</code></td></tr><tr><td><strong>슬라이스(Slice)</strong></td><td>레이어 안에서 도메인(비즈니스 요구사항)으로 나눈 폴더</td><td><code>features/user/</code>, <code>features/post/</code></td></tr><tr><td><strong>세그먼트(Segment)</strong></td><td>슬라이스 안에서 역할(기능)별로 나눈 폴더</td><td><code>api/</code>, <code>model/</code>, <code>ui/</code></td></tr></tbody></table> <p>“프론트엔드 방법론인데 백엔드에 억지로 녹이는 거 아닌가?” — 타당한 의문이에요. 맞아요, FSD는 프론트엔드 방법론입니다. <code>pages</code>나 <code>widgets</code> 같은 이름을 백엔드 프로젝트에 그대로 쓸 이유는 없죠. 그런데 FSD를 깊이 보면, 핵심은 <code>app</code>, <code>pages</code>, <code>features</code> 같은 <strong>폴더 이름이 아닙니다.</strong></p> <p>클린 아키텍처도 의존성 방향이라는 명확한 원칙을 제시하지만, 실제로 폴더를 어떻게 나눌지는 해석에 맡겨져 있어요. FSD는 거기서 한 발 더 나아가서 레이어 이름과 슬라이스 개념을 직접 정해두고 어느 정도 강제성을 부여합니다. 팀마다 해석이 달라지는 여지가 줄어드는 거죠.</p> <p>그보다 더 중요한 건 — <strong>FSD는 물리적인 폴더의 참조 관계를 설명할 수 있는 언어를 제공합니다.</strong> 이 언어를 이해하고 자신의 프로젝트에 녹인다면, FSD의 폴더 이름을 그대로 쓰지 않더라도 폴더 구조의 오류를 발견하고 수정할 수 있어요.</p> <div class="markdown-alert markdown-alert-note"><p class="markdown-alert-title"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Note</p> <p>이 글에서 쓰는 <code>domain</code>, <code>app</code>, <code>features</code>, <code>infra</code> 같은 레이어 이름은 개념을 설명하기 위한 예시입니다. 특정 명칭을 그대로 써야 한다는 의미가 아니에요. 중요한 건 이름이 아니라 참조 방향에 대한 사고방식입니다.</p></div> <h2 id="layer-import-rule과-public-api-규칙"><a href="#layer-import-rule과-public-api-규칙">Layer Import Rule과 Public API 규칙</a></h2> <p>FSD가 제시하는 규칙 중, 딱 두 가지만 이해해도 폴더 설계 방식의 큰 틀이 잡힙니다.</p> <h3 id="layer-import-rule"><a href="#layer-import-rule">Layer Import Rule</a></h3> <p><a href="https://feature-sliced.design/kr/docs/reference/layers#import-%EA%B7%9C%EC%B9%99" rel="noopener noreferrer" target="_blank">FSD 레이어 문서</a>에 따르면, 레이어 간 참조에는 두 가지 규칙이 있습니다.</p> <p>첫째, <strong>레이어 간 참조는 항상 단방향이어야 합니다.</strong> 상위 레이어는 하위 레이어를 참조할 수 있지만, 그 반대는 안 됩니다.</p> <p>둘째, <strong>같은 레이어 내의 슬라이스(폴더)끼리는 서로를 참조할 수 없습니다.</strong> (<code>shared</code> 레이어는 예외)</p> <!> <p>두 번째 규칙이 핵심이에요. 계층 기준 구조에서는 같은 <code>service/</code> 안에서 서로 참조가 발생했고, 기능 기준 구조에서는 <code>user/</code>와 <code>post/</code>가 서로를 import했습니다. Layer Import Rule은 이 문제에 명확한 답을 제시해요 — 같은 레이어에 있다면 서로 참조하면 안 됩니다. 참조가 필요하다면 공유 대상을 더 하위 레이어로 내려야 합니다.</p> <h3 id="public-api-규칙"><a href="#public-api-규칙">Public API 규칙</a></h3> <p><a href="https://feature-sliced.design/kr/docs/reference/public-api" rel="noopener noreferrer" target="_blank">FSD Public API 문서</a>에 따르면, 각 슬라이스(폴더)는 외부에 공개할 것만 명시적으로 내보냅니다. 외부에서는 이 공개 API를 통해서만 접근할 수 있고, 내부 파일을 직접 참조하는 건 금지됩니다.</p> <p>핵심은 <strong>외부 코드가 슬라이스의 내부 구조를 알 필요가 없다</strong>는 거예요. 인터페이스와 같은 효과입니다. 내부가 어떻게 구성되어 있든 — 파일 이름이 바뀌든, 내부 구조가 재편되든 — 공개 API만 유지된다면 외부에는 아무런 영향이 없습니다.</p> <p>Layer Import Rule은 대부분의 프로젝트에 일관되게 적용하기 좋습니다. 하지만 슬라이스 내부는 다릅니다. 기능 파일들이 밀집한 곳에서는 예외 케이스가 많고, 규칙을 세워도 또 다른 오류가 나오기 쉬운 복잡한 영역이에요. Public API 규칙은 여기서 유연성을 제공합니다 — 내부 구조에 대한 엄격한 규칙 대신, 외부와의 경계선을 명확히 정의하는 방식으로요.</p> <hr/> <p>이 두 규칙만 이해해도 폴더 설계의 큰 틀이 잡힙니다. “이 파일을 어디에 두면 좋을까?”, “이 참조가 허용되는 방향인가?”라는 질문에 스스로 답할 수 있게 돼요.</p> <h2 id="레이어-기준과-기능-기준-둘-다-쓴다"><a href="#레이어-기준과-기능-기준-둘-다-쓴다">레이어 기준과 기능 기준, 둘 다 쓴다</a></h2> <p>앞서 계층 기준과 기능 기준을 각각 살펴봤어요. 이제 그 질문을 다시 꺼내봅시다. “그래서 결국 둘 중 어떤 기준으로 폴더를 나눠야 하나요?”</p> <p>정답은 <strong>둘 다 씁니다 — 적용되는 영역이 다를 뿐</strong>입니다.</p> <p>실마리는 FSD의 <code>shared</code> 레이어에 있어요. <code>shared</code>에는 어떤 코드가 들어갈까요? 날짜 포맷팅 유틸리티, 환경 변수 설정, 공통 상수, 범용 타입 정의 같은 것들이에요. 공통점이 하나 있습니다 — 이 코드들은 <strong>어떤 도메인, 어떤 기능과도 무관합니다.</strong> 프로젝트가 쇼핑몰이든 블로그든, <code>formatDate</code> 함수는 똑같이 생겼어요.</p> <p>여기서 폴더 설계의 첫 번째 분류 기준이 생깁니다.</p> <ul><li><strong>도메인과 무관한 코드</strong> — 어느 프로젝트에서도 비슷하게 쓰이는 유틸리티, 설정, 공통 기반 → <code>app</code>,<code>shared</code></li> <li><strong>도메인과 관련된 코드</strong> — 이 서비스의 비즈니스에 특화된 모든 코드 → <code>pages</code>, <code>features</code> 등</li></ul> <!> <p>이 분류는 <strong>레이어 기준</strong>입니다. 그리고 <code>pages</code> 안을 세분화할 때 비로소 <strong>기능(도메인) 기준</strong>을 적용합니다.</p> <!> <p>레이어 우선, 그 안에서 슬라이스. 이게 FSD가 제시하는 폴더 설계의 기본 골격이에요. 두 기준이 충돌하는 게 아니라, 적용되는 범위가 다릅니다.</p> <h3 id="shared와-app은-슬라이스가-없다"><a href="#shared와-app은-슬라이스가-없다">shared와 app은 슬라이스가 없다</a></h3> <p><a href="https://feature-sliced.design/kr/docs/reference/slices-segments" rel="noopener noreferrer" target="_blank">FSD 문서</a>에 따르면, <code>shared</code>와 <code>app</code>은 다른 레이어와 구조가 다릅니다. 나머지 레이어에는 슬라이스(도메인 단위 폴더)가 있지만, 이 두 레이어는 <strong>세그먼트로만 구성</strong>됩니다.</p> <ul><li><code>shared</code>는 비즈니스 로직이 없기 때문에 도메인 단위로 나눌 이유가 없습니다. <code>utils/</code>, <code>config/</code>, <code>constants/</code> 같은 기술적 역할 기준의 세그먼트로 구성됩니다.</li> <li><code>app</code>은 애플리케이션 전체를 초기화하는 최상위 설정을 담습니다. 서버 진입점, 전역 미들웨어, 루트 모듈처럼 도메인 슬라이스가 직접 참조하지 않는 코드들이에요. 하나의 애플리케이션에 하나뿐이므로 슬라이스로 나눌 이유가 없습니다.</li></ul> <p>슬라이스가 없다는 건 세그먼트 간의 협력이 허용된다는 의미이기도 해요. 다른 레이어에서 슬라이스들이 서로를 참조하면 안 되는 것과 달리, <code>shared</code>의 <code>utils/</code>는 <code>config/</code>를 참조할 수 있습니다. 다만 양방향 참조가 생기지 않도록 관리하는 건 여전히 개발자의 몫이에요.</p> <hr/> <p>이 글 아래에서 사용하는 <code>app/</code> 폴더는 FSD의 <code>app</code> 레이어와 다릅니다. <strong>여기서 <code>app/</code>은 프레젠테이션과 비즈니스 로직이 아직 혼재된 애플리케이션 레이어 전체를 가리키는 표현이에요</strong> — FSD의 <code>pages</code>나 <code>features</code>에 더 가깝습니다.</p> <h2 id="점진적인-설계-기법"><a href="#점진적인-설계-기법">점진적인 설계 기법</a></h2> <p>처음부터 완벽한 구조를 만들 필요는 없어요. 복잡도가 실제로 문제가 될 때 단계적으로 개선하면 됩니다.</p> <h3 id="1단계-domain-레이어-분리"><a href="#1단계-domain-레이어-분리">1단계: domain 레이어 분리</a></h3> <p><code>app</code> 레이어 내부 폴더들이 서로를 참조하기 시작하면, 그 원인이 되는 것들을 <code>domain</code> 레이어로 꺼냅니다. ORM 엔티티, 도메인 모델, Repository 인터페이스, 다른 도메인에 의존하지 않는 핵심 서비스 등이 여기 해당해요.</p> <!> <p>이렇게 분리하면 <code>app</code> 레이어에 <strong>내부 폴더 간 참조 금지</strong> 규칙을 적용할 수 있어요. 폴더 간에 공유해야 할 것들이 이미 <code>domain</code>으로 이동했으니까요.</p> <!> <p>또 다른 장점이 생겨요. <code>app</code> 레이어가 이제 API 리소스 구조를 명확하게 표현할 수 있습니다.</p> <!> <p>폴더 구조만 봐도 “이 애플리케이션이 어떤 인터페이스를 제공하는가”가 한눈에 보여요.</p> <div class="markdown-alert markdown-alert-note"><p class="markdown-alert-title"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Note</p> <p>여기서 말하는 <code>domain</code> 레이어는 클린 아키텍처나 DDD의 “순수한 도메인 레이어”와는 달라요. Repository 구현체가 있어도 되고, ORM 엔티티를 직접 써도 됩니다. 중요한 건 <code>app</code> 레이어에서 재사용 가능한 핵심 로직을 분리한다는 실용적인 목적이에요.</p></div> <h3 id="2단계-features-레이어--재사용되는-유즈케이스"><a href="#2단계-features-레이어--재사용되는-유즈케이스">2단계: features 레이어 — 재사용되는 유즈케이스</a></h3> <p><code>app</code> 레이어의 여러 폴더에서 같은 비즈니스 로직이 필요해지는 순간이 와요. 예를 들어 “게시글 작성” 기능이 일반 사용자 API(<code>/posts</code>)와 관리자 API(<code>/admin/posts</code>)에서 모두 필요한 경우입니다.</p> <p>이 로직을 <code>domain</code>에 넣기엔 너무 상위 레벨의 비즈니스 흐름이고, <code>app</code>에 두자니 재사용이 안 돼요. 그래서 그 사이에 <code>features</code> 레이어를 둡니다.</p> <!> <h2 id="oop의-의존성-역전-원칙과-폴더-참조관계"><a href="#oop의-의존성-역전-원칙과-폴더-참조관계">OOP의 의존성 역전 원칙과 폴더 참조관계</a></h2> <p>한 가지 오해를 미리 풀고 싶어요. 아래에서 설명하는 구조에서 양방향 참조가 발생하는 게 아닙니다. 화살표의 방향이 다를 뿐이에요.</p> <hr/> <p><code>features</code> 레이어는 그 자체만으로도 충분히 가치 있습니다. <code>app</code> 레이어의 여러 슬라이스에서 재사용해야 하는 비즈니스 로직을 분리해두는 것만으로도 구조가 훨씬 명확해지거든요. 여기서 한 발 더 나아갈 수 있어요. OOP의 <strong>의존성 역전 원칙(DIP)</strong> 을 폴더 참조 관계에 적용하는 겁니다.</p> <p>현재 구조에서 <code>domain</code> 레이어는 도메인 모델과 함께 Repository 구현체도 가지고 있어요. <code>domain</code>이 DB, 즉 인프라 세부사항에 의존하는 셈입니다. 이게 당장 문제가 되지 않더라도, 테스트하기 어렵고 인프라를 교체하기도 어려워집니다.</p> <p>DIP를 쓰면 이 방향을 뒤집을 수 있어요. <code>domain</code>에는 인터페이스만 두고, 구현체는 <code>infra</code> 레이어로 꺼냅니다.</p> <!> <!> <p>물리적인 import 방향은 <code>infra → domain</code>이에요. <code>infra</code>가 <code>domain</code>의 인터페이스를 가져다 구현합니다. <code>domain</code>은 <code>infra</code>를 전혀 모르고요. 결과적으로 의존 방향은 <code>app → domain ← infra</code>가 됩니다.</p> <p>양방향 참조처럼 보일 수 있지만 아닙니다. <code>app</code>이 <code>domain</code>을 바라보고, <code>infra</code>도 <code>domain</code>을 바라봅니다. <code>domain</code>은 아무것도 바라보지 않아요. 화살표의 목적지가 같을 뿐, 방향은 모두 <code>domain</code>을 향하고 있습니다.</p> <p>DB 엔진을 교체하거나 외부 API 연동 방식을 바꿔도 <code>domain</code> 레이어는 건드릴 필요가 없어요. 인프라 세부사항이 완전히 격리되어 있거든요.</p> <h2 id="그렇다면-증명할-수-있는가"><a href="#그렇다면-증명할-수-있는가">그렇다면, 증명할 수 있는가</a></h2> <p>저의 포스팅도 하나의 해석입니다. 저의 포스팅도 하나의 해석입니다. 세상에는 많은 방법이 존재하고 그렇기 때문에 더 나은 구조가 분명 있습니다.</p> <p>개발 커뮤니티에서는 어려운 개념을 단순하게 설명하는 아이디어가 빠르게 퍼지며 통념이 되곤 합니다. 누군가 책을 읽고, 자신의 해석을 제시하고, 글 몇 편과 저장소를 공유하면 어느새 그 해석이 표준처럼 굳어져요. 해석의 정확성보다 확산 속도와 글쓴이의 영향력이 더 크게 작동하는 경우도 적지 않습니다.</p> <p>이 글에서 다루는 FSD도 그 흐름 속에 있어요. 특별한 존재가 아닙니다. 다만 FSD는 자신의 설계를 명시적인 규칙으로 문서화하고, 실제 프로젝트에서 검증하며, 커뮤니티의 피드백을 거쳐 발전해왔어요. 그 과정이 어느 정도의 신뢰를 만들어줬다고 생각합니다.</p> <p>저도 같은 의심을 품었던 적이 있어요. 클린 아키텍처를 공부하면서 나만의 해석으로 폴더 구조를 만들어본 적이 있거든요. 나름 논리적이라고 생각했습니다. 그런데 다른 개발자와 논의하면서 생각보다 많은 오류를 발견했어요. 설명하지 못하는 부분도 있었고, 내 해석 자체가 틀린 것도 있었습니다. 결국 그 구조는 포기했어요. 그때 느낀 건, 아직 한참 부족하다는 거였어요.</p> <p>폴더 구조에 정답은 없습니다. 하지만 어떤 방법이든 분명 <strong>규칙은 있어야 합니다.</strong> 그리고 그 규칙을 정확히 정의할 수 있어야 합니다.</p> <p>당신의 답은 무엇인가요?</p>',1);function O(a){var t=A(),r=e(k(t),14);s(r,()=>`<div class="mermaid">graph TD
    subgraph "계층 기준 폴더 구조"
        C["controller/"]
        S["service/"]
        R["repository/"]
        D["dto/"]
    end

    C --> S
    S --> R
    C -.-> D
    S -.-> D
    R -.-> D</div>`);var p=e(r,8);s(p,()=>`<div class="mermaid">graph TD
    subgraph "service/"
        OS["OrderService
(오케스트레이션)"]
        US["UserService"]
        PS["PaymentService"]
    end

    OS --> US
    OS --> PS

    style US fill:none,stroke:#e74c3c,stroke-width:2px
    style PS fill:none,stroke:#e74c3c,stroke-width:2px</div>`);var o=e(p,12);s(o,()=>`<div class="mermaid">graph LR
    subgraph "user/"
        UC["UserController"]
        US["UserService"]
        UR["UserRepository"]
    end

    subgraph "post/"
        PC["PostController"]
        PS["PostService"]
        PR["PostRepository"]
    end

    UC --> US --> UR
    PC --> PS --> PR

    PS --> UR
    US <--> PS

    style US fill:none,stroke:#e74c3c,stroke-width:2px
    style PS fill:none,stroke:#e74c3c,stroke-width:2px
    style UR fill:none,stroke:#e74c3c,stroke-width:2px</div>`);var d=e(o,56);s(d,()=>`<div class="mermaid">graph TD
    A["app (최상위)"] --> F["features"]
    A --> D["domain"]
    F --> D
    D --> S["shared (최하위)"]

    subgraph "domain/ — 슬라이스 간 참조 금지 ❌"
        U["user/"]
        P["post/"]
        U -.-x P
    end</div>`);var n=e(d,28);s(n,()=>`<div class="mermaid">graph TD
    A["src/"] --> S["shared/
도메인과 무관한 코드"]
    A --> APP["app/
전역 설정"]
    A --> P["pages/
도메인과 관련된 코드"]</div>`);var i=e(n,4);s(i,()=>`<div class="mermaid">graph TD
    A["src/"] --> S["shared/"]
    A --> APP["app/"]
    A --> P["pages/"]
    P --> U["user/"]
    P --> Po["post/"]
    P --> AU["auth/"]</div>`);var c=e(i,24);s(c,()=>`<pre class="shiki shiki-themes github-light github-dark" style="background-color:#fff;--shiki-dark-bg:#24292e;color:#24292e;--shiki-dark:#e1e4e8" tabindex="0"><code><span class="line"><span>src/</span></span>
<span class="line"><span>├── app/</span></span>
<span class="line"><span>│   ├── users/        // Controller + 오케스트레이션 Service</span></span>
<span class="line"><span>│   ├── posts/</span></span>
<span class="line"><span>│   └── admin/</span></span>
<span class="line"><span>├── domain/           // 새로 분리한 레이어</span></span>
<span class="line"><span>│   ├── user/</span></span>
<span class="line"><span>│   │   ├── index.ts</span></span>
<span class="line"><span>│   │   ├── user.entity.ts</span></span>
<span class="line"><span>│   │   ├── user.repository.ts   // 인터페이스</span></span>
<span class="line"><span>│   │   └── user-core.service.ts</span></span>
<span class="line"><span>│   └── post/</span></span>
<span class="line"><span>└── shared/</span></span></code></pre>`);var l=e(c,4);s(l,()=>`<div class="mermaid">graph TD
    subgraph "app/ (참조 금지 ❌)"
        AU["users/"]
        AP["posts/"]
        AA["admin/"]
    end

    subgraph "domain/"
        DU["user/"]
        DP["post/"]
    end

    subgraph "shared/"
        SU["utils/"]
        SC["config/"]
    end

    AU --> DU
    AU --> DP
    AP --> DP
    AA --> DU
    AA --> DP
    DU --> SU
    DP --> SC</div>`);var g=e(l,4);s(g,()=>`<pre class="shiki shiki-themes github-light github-dark" style="background-color:#fff;--shiki-dark-bg:#24292e;color:#24292e;--shiki-dark:#e1e4e8" tabindex="0"><code><span class="line"><span>app/</span></span>
<span class="line"><span>├── users/</span></span>
<span class="line"><span>├── posts/</span></span>
<span class="line"><span>├── auth/</span></span>
<span class="line"><span>├── admin/</span></span>
<span class="line"><span>│   ├── users/</span></span>
<span class="line"><span>│   ├── posts/</span></span>
<span class="line"><span>│   └── dashboard/</span></span>
<span class="line"><span>├── home/</span></span>
<span class="line"><span>└── feed/</span></span></code></pre>`);var u=e(g,12);s(u,()=>`<pre class="shiki shiki-themes github-light github-dark" style="background-color:#fff;--shiki-dark-bg:#24292e;color:#24292e;--shiki-dark:#e1e4e8" tabindex="0"><code><span class="line"><span>src/</span></span>
<span class="line"><span>├── app/</span></span>
<span class="line"><span>├── features/</span></span>
<span class="line"><span>│   ├── create-post/</span></span>
<span class="line"><span>│   │   ├── index.ts               // public API</span></span>
<span class="line"><span>│   │   ├── create-post.service.ts</span></span>
<span class="line"><span>│   │   └── create-post.dto.ts</span></span>
<span class="line"><span>│   ├── delete-user/</span></span>
<span class="line"><span>│   └── send-notification/</span></span>
<span class="line"><span>├── domain/</span></span>
<span class="line"><span>└── shared/</span></span></code></pre>`);var f=e(u,14);s(f,()=>`<pre class="shiki shiki-themes github-light github-dark" style="background-color:#fff;--shiki-dark-bg:#24292e;color:#24292e;--shiki-dark:#e1e4e8" tabindex="0"><code><span class="line"><span>domain/</span></span>
<span class="line"><span>└── user/</span></span>
<span class="line"><span>    ├── user.entity.ts</span></span>
<span class="line"><span>    └── user.repository.ts        // 인터페이스만 정의</span></span>
<span class="line"><span></span></span>
<span class="line"><span>infra/</span></span>
<span class="line"><span>└── repositories/</span></span>
<span class="line"><span>    └── user.repository.impl.ts   // domain의 인터페이스를 implements</span></span></code></pre>`);var _=e(f,2);s(_,()=>`<div class="mermaid">graph LR
    A["app"] --> D["domain"]
    A --> I["infra"]
    I -->|"implements interface"| D

    style D fill:none,stroke:#10b981,stroke-width:2px
    style I fill:none,stroke:#6b7280,stroke-width:2px</div>`),h(20),S(a,t)}const H=Object.freeze(Object.defineProperty({__proto__:null,default:O,metadata:P},Symbol.toStringTag,{value:"Module"})),I=""+new URL("../assets/dunning-kruger-effect.BMRh7KUf.webp",import.meta.url).href,x=""+new URL("../assets/pdf-translate-example.DHRVO8FS.png",import.meta.url).href,y={title:"SOLID 원칙, 맹신과 타협 사이에서",description:"SOLID 원칙. 객체지향 프로그래밍 이야기가 나오면 마법처럼 튀어나오는 단어다. 이 글은 내가 이 원칙을 진지하게 마주하고, 나만의 결론에 도달하기까지의 과정을 담았다.",date:"LONG_AGO",order:1,tags:["oop","design-patterns"],coverColor:"#EDE8DF",published:!0},{title:J,description:K,date:V,order:q,tags:Q,coverColor:W,published:X}=y;var U=D('<p>원칙이란 일관되게 지켜야 하는 기본적인 규칙이나 법칙을 말한다. SOLID 원칙은 객체지향 프로그래밍을 하는 개발자라면 당연히 지켜야 하는 규칙이다. 이 명제는 한동안 나를 지배했었다. 하지만 비용이라는 벽을 만나며, 규칙을 깨는 범법자가 될 수밖에 없는 상황들을 마주하게 되었다.</p> <p>현재 개발에 드는 시간과 미래의 유지보수 비용. 어느 쪽에 무게를 둘 것인가에 따라 원칙은 지켜지기도, 깨지기도 하였다. 이 글은 그 저울질 끝에 내가 내린 결론에 대한 이야기다.</p> <h2 id="책임은-누가-정하는가"><a href="#책임은-누가-정하는가">“책임”은 누가 정하는가</a></h2> <p>SOLID 원칙 중 나를 가장 오랫동안 괴롭혀온 것은 단일 책임 원칙(Single Responsibility Principle)이다. 클래스는 하나의 책임만 가져야 한다. 모듈이 변경되는 이유는 하나여야 한다. 유지보수성을 위해… 그래, 대략 무엇을 말하는지는 알겠다. 컨트롤러는 요청을 받고, 서비스는 비즈니스 로직을 처리하고. 너무 당연한 말이다.</p> <p>웹 개발에서 범용적으로 쓰이는 레이어나 정해진 디자인 패턴 같은 코드들은, 오랜 시간 쌓여온 관례를 통해 판단할 수 있는 근거가 있다. 그래서 단일 책임 역시 설명이 되는 듯했다.</p> <p>하지만 관례가 닿지 않는 곳은 존재한다. “책임”이라는 단어는 너무 주관적이기 때문이다. 어느 날, 어떤 클래스를 두고 책임에 대한 논의가 이어졌다. 내가 이해하는 단일 책임을 명쾌하게 설명할 수 있어야 했는데, 그러지 못했다. 같은 문제를 비슷하게 바라보고 있으면서도, 정작 “왜 이것이 하나의 책임인가”를 증명할 수 없었다. 나는 단일 책임 원칙을 안다고 착각하고 있었을 뿐이다.</p> <h2 id="solid-원칙은-부메랑처럼-돌아온다"><a href="#solid-원칙은-부메랑처럼-돌아온다">SOLID 원칙은 부메랑처럼 돌아온다</a></h2> <p>주니어 시절, Java를 배우며 SOLID 원칙을 자연스럽게 알게 되었다. 당시 스택오버플로우에서 이 원칙을 두고 의견이 대립하는 글을 읽었고, “필요에 따라 적용하면 된다”는 누군가의 댓글에 안도감을 느끼며 빠르게 타협을 내렸다.</p> <p>어떤 단어의 줄임말인지, 각 원칙의 이름과 설명, 면접에서 물어볼까 봐 달달 외워둔 대략적인 예시. 그 이상은 큰 관심사가 아니었다. 부끄럽게도.</p> <p>몇 년이 흐르고, 우매함의 봉우리에서 절망의 계곡으로 곤두박질쳤을 때 SOLID 원칙에 대한 궁금증은 부메랑처럼 돌아왔다. 마치 이제야 진실의 단편을 맛볼 준비가 되었다는 듯이.</p> <p><img alt="더닝-크루거 효과"/></p> <p>블로그와 유튜브에서 알려주는 정보로는 갈증을 해결할 수 없었다. 개방 폐쇄부터 의존성 역전까지, 나머지 원칙들은 회사 프로젝트와 개인 프로젝트를 진행하며 차츰 원리를 깨달아갔지만(반쯤은 착각이다), 단일 책임 원칙만큼은 진정으로 이해할 수 없었기 때문이다. 유튜브에는 로버트 마틴이 직접 설명하는 영상도 있었지만, 영어를 못하는 나는 느린 번역과 오역을 견디지 못하고 포기했다.</p> <p>결국 로버트 C. 마틴의 <a href="https://web.archive.org/web/20150906155800/http://www.objectmentor.com/resources/articles/Principles_and_Patterns.pdf" rel="noopener noreferrer" target="_blank">논문</a>까지 거슬러 올라갔다. 구글 번역기를 돌려가며 한 문장씩 읽어 내려갔고, 몇 년간 무지했던 자신과의 싸움 끝에 — 한 번 더 절망을 맛보았다. 논문 어디에도 단일 책임(Single Responsibility)이라는 원칙이 없었기 때문이다.</p> <p>논문의 “Principles of Object Oriented Class Design” 섹션에서 다루는 원칙은 OCP(Open Closed Principle), LSP(Liskov Substitution Principle), DIP(Dependency Inversion Principle), ISP(Interface Segregation Principle) 뿐이었다. 내가 제일 궁금했던 부분이 나를 농락하기라도 하듯 보이질 않으니, 미칠 지경이었다.</p> <p><img alt="논문을 번역하던 시절을 재현"/> <em>(당시 번역기를 돌리다가 OCP가 SRP 보다 먼저 나와서 당황하며, 앞뒤로 “Single”, “SRP”를 검색하며 절망했던 순간을 재현)</em></p> <p>한참 뒤에 알게 된 사실인데, SOLID라는 약어는 로버트 마틴이 만든 것이 아니었다. 마이클 페더스(Michael Feathers)가 로버트 마틴에게 “이 원칙들의 앞글자를 따면 SOLID가 된다”고 이메일로 제안하면서 탄생한 이름이다. 단일 책임 원칙은 로버트 마틴이 이후 저서에서 별도로 정리한 원칙이었고, 이 논문에는 애초에 존재하지 않았던 것이다.</p> <h2 id="유레카는-미묘하게-찾아온다"><a href="#유레카는-미묘하게-찾아온다">유레카는 미묘하게 찾아온다</a></h2> <p>어린 시절, 두발자전거를 처음 탔을 때의 기억이 있다. 몇 번이고 넘어지고, 아무리 발버둥 쳐도 그날은 끝내 타지 못했다. 그런데 며칠 뒤, 아무 기대 없이 다시 올라탔을 때 마법처럼 페달이 돌아갔다. 레미니센스 효과라고 한다. 학습 직후보다 시간이 지난 뒤에 오히려 수행이 향상되는 현상이다.</p> <p>한동안 내 뇌는 단일 책임 원칙에 대해 찾아보는 행위 자체를 거부했다. 자포자기였던 것 같다.</p> <p>하지만 논문을 읽었던 행위는 나도 모르게 새로운 방향을 심어두고 있었다. 논문에는 블로그나 유튜브에서는 볼 수 없었던 것이 있었다. 저자의 철학. 로버트 마틴이 왜 이 글을 썼는지, 무엇이 그를 움직였는지가 행간에 배어 있었다.</p> <p>논문은 2000년에 나왔다. 제목은 “Design Principles and Design Patterns”. 그런데 GoF의 Design Patterns는 이미 6년 전인 1994년에 출간되었다. 객체지향 언어는 그 자체로 유지보수성과 재사용성을 약속했고, 상황별 설계 해법도 어느 정도 정립된 시점이었다. 그럼에도 로버트 마틴이 이 논문을 써야 했다는 것은, OOP와 디자인 패턴만으로는 해결되지 않는 문제가 현실에 존재했다는 뜻이었다.</p>',1);function R(a){var t=U(),r=e(k(t),20),p=m(r);v(r);var o=e(r,8),d=m(o);h(2),v(o),h(12),w(()=>{b(p,"src",I),b(d,"src",x)}),S(a,t)}const Y=Object.freeze(Object.defineProperty({__proto__:null,default:R,metadata:y},Symbol.toStringTag,{value:"Module"}));function Z(a){return a==="LONG_AGO"?"오래전":new Date(a).toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric"})}function ee(a){if(a==="LONG_AGO")return"오래전";const t=Date.now(),r=new Date(a).getTime(),p=t-r,o=Math.floor(p/6e4),d=Math.floor(p/36e5),n=Math.floor(p/864e5),i=Math.floor(n/7),c=Math.floor(n/30),l=Math.floor(n/365);return o<1?"방금 전":o<60?`${o}분 전`:d<24?`${d}시간 전`:n<7?`${n}일 전`:i<5?`${i}주 전`:c<12?`${c}개월 전`:`${l}년 전`}export{H as _,Y as a,Z as f,ee as t};
