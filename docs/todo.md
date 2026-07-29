- i (admin) should be able to add lessons for specific students. so i have control over the lessons that the students see. i guess this means that i should have lesson management so that i can add a lesson and then link students with the lesson? open to discussion on this feature.
- notification system
-- notify student when there is a new lesson available for them
-- i (admin) has feature to send message to a specific student/chatting, so students can ask/answer questions. the notification will redirect student to the messaging room with me
- messaging system
-- students can access two rooms, one room with me, and another with the other students so they can freely ask questions about lessons 
-- check duplicate login again since it's still not working

lesson:
- i will start creating lessons. There will be two types of lessons for now. Vocarefer to stitch screen "Student: Vocab Overview (Vowels)" for lesson 0 vocabs. So I w

- 한글 vowels vocab 
- 한글 vowels vocab quiz
- 한글 consonants vocab
- 한글 consonants vocab quiz
- 한글 reading 1 vocab (시소, 사자, 새, 뼈, 시계, 소주, 쏘다, 자두, 싸다, 바지, 피자, 고추, 치즈, 휴지, 호수, 나무, 나비, 바나나, 우유, 사과, 왜, 더워요, 가위, 오리, 토마토, 의사, 모자, 스웨터, 모래, 의자, 주사위)
- 한글 reading 1 vocab quiz (no 받침)
- 한글 받침 custom lesson 
    -- refer to docs/reference/20260726_131127.jpg for lesson content
- 한글 reading 2 vocab (가방, 교실, 김치, 돈, 당근, 리본, 물, 라면, 사탕, 수박, 양말, 김밥, 자전거, 장갑, 지하철, 친구, 컴퓨터, 풍선, 학교, 호랑이)
- 한글 reading 2 vocab quiz (with 받침)
- test out quiz: 한글

Vocab quizzes should include 10 random questions. Two questions should be matching format. Refer to stitch "Student: Quiz - Matching Vocab" screen for matching quiz format. 8 questions should be fill in the blank quizzes.


there are three ways to answer fill in the blank quizzes. multiple choice, syllable blocks, and finally the hardest one is typing the answer. When you need to make a fill in the blank quizzes, randomly create the quiz with the following probabilities: 50% multiple choice, 30% syllable blocks, 20% typing the answer. Look at stitch to refer to how each screen would be like: 
- Student: Quiz - Multiple Choice (Apple)
- Student: Quiz - Syllable Builder (Apple)
- Student: Quiz - Keyboard Input (Apple)


lessons are currently stored in localStorage. move this to DB if pattern is found, if not, then save it as data?? idk i guess we'll figure this out later.

how do you suggest i effectively and efficiently store the lessons? consider future additional lessons. see if there are patterns in the lessons created so that code won't be redundant and data model is efficient.


lesson:
title: Hobbies (취미)
type: Vocab
words: 요리, 야구, 컴퓨터 게임, 음악 감상, 수영, 농구, 태권도, 독서, 영화 감상, 여행, 쇼핑, 축구, 러닝, 그림 그리기, 필라테스, 산책
 

 lesson: 
 title: Occupation (직업)
 
 title: Sino Numbers (숫자)
type: Vocab
words: 영(공), 일, 이, 삼, 사, 오, 육, 칠, 팔, 구, 십, 십일, 십이, 십삼, 십오, 십육, 십칠, 십팔, 십구, 이십, 삼십, 사십, 오십, 육십, 칠십, 팔십, 구십, 백, 천, 만

title: Korean Numbers (숫자)
type: Vocab
words: 하나, 둘, 셋, 넷, 다섯, 여섯, 일곱, 여덟, 아홉, 열, 열하나, 열둘, 열넷, 열다섯, 열여섯, 열일곱, 열여덟, 열아홉, 스물, 서른, 마흔, 쉰, 예순, 일흔, 여든, 아흔, 백, 천, 만

