Installation
$ npm install
Running the app
# development
$ npm run start
Test
# unit tests
$ npm run test
활용 기술 스택
TypeScript NodeJS Express.js MySQL

Dev-Environment: Node.js
Language: Typescript
Framework: Express
ORM: type-orm
RDBMS: MySQL


파일구조
📦src
 ┣ 📂commons
 ┃ ┣ 📜exceptions.ts
 ┃ ┗ 📜returnData.ts
 ┣ 📂configs
 ┃ ┣ 📜database.ts
 ┃ ┗ 📜index.ts
 ┣ 📂controllers
 ┃ ┣ 📜companyController.ts
 ┃ ┣ 📜index.ts
 ┃ ┣ 📜recruitController.ts
 ┃ ┗ 📜userController.ts
 ┣ 📂interfaces
 ┃ ┣ 📂company
 ┃ ┣ 📂recruit
 ┃ ┗ 📂user
 ┣ 📂middlewares
 ┃ ┗ 📜errorHandler.ts
 ┣ 📂models
 ┃ ┣ 📂responseData
 ┃ ┃ ┗ 📜recruitResponse.ts
 ┃ ┣ 📜Company.entity.ts
 ┃ ┣ 📜Recruit.entity.ts
 ┃ ┣ 📜User.entity.ts
 ┃ ┗ 📜index.ts
 ┣ 📂repositories
 ┃ ┣ 📂repoParams
 ┃ ┃ ┣ 📜createNewCompanyReq.ts
 ┃ ┃ ┣ 📜createNewRecruitReq.ts
 ┃ ┃ ┗ 📜updateRecruitReq.ts
 ┃ ┣ 📂test
 ┃ ┃ ┗ 📜userRepository.test.ts
 ┃ ┣ 📜companyRepository.ts
 ┃ ┣ 📜index.ts
 ┃ ┣ 📜recruitRepository.ts
 ┃ ┗ 📜userRepository.ts
 ┣ 📂routers
 ┃ ┣ 📜company.ts
 ┃ ┣ 📜index.ts
 ┃ ┣ 📜recruit.ts
 ┃ ┗ 📜user.ts
 ┣ 📂services
 ┃ ┣ 📜companyService.ts
 ┃ ┣ 📜index.ts
 ┃ ┣ 📜recruitService.ts
 ┃ ┗ 📜userService.ts
 ┣ 📂test
 ┗ 📜app.ts


ERD Diagram




API 정보구현
유저 (User)
URL	Method	기능명	요구사항
/user/	GET	전체 유저 조회	본인직접 구현
/user/:id	GET	유저 아이디(id)로 유저정보조회	본인직접 구현
/user/	POST	유저생성	본인직접 구현
/user/apply	POST	유저가 채용공고에 지원	가산점 요소(#6)
회사 (Company)
URL	Method	기능명	요구사항
/company/	GET	전체 회사 조회	본인직접 구현
/company/:id	GET	회사 아이디(id)로 회사정보조회	본인직접 구현
/company/	POST	회사 생성	본인직접 구현
/company/:id	DELETE	회사 삭제	본인직접 구현
채용공고 (Recruit)
URL	Method	기능명	요구사항
/recruit/	POST	채용공고 등록	필수 요소(#1)
/recruit/:id	PUT	채용공고 아이디(id)에 해당하는 채용공고 수정	필수 요소(#2)
/recruit/:id	DELETE	채용공고 아이디(id)에 해당하는 채용공고 삭제	필수 요소(#3)
/recruit/	GET	채용공고 목록 조회	필수 요소(#4-1)
/recruit/url	GET	채용공고 검색기능 구현	가산점 요소(#4-2)
/recruit/:id	GET	채용상세 페이지 조회	필수 요소(#5)
Models
User.entity.ts - 유저 모델
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recruit } from './Recruit.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 30, nullable: false })
  name!: string; // 지원자 이름

  // 지원한 채용공고
  @ManyToMany(() => Recruit)
  @JoinTable()
  recruits: Recruit[];
}

Company.entity.ts - 회사 모델
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recruit } from './Recruit.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string; // 회사명

  @Column({ nullable: false, default: '대한민국' })
  country: string; // 국가

  @Column()
  location: string; //지역

  // 회사가 올린 채용공고
  @OneToMany((type) => Recruit, (recruit) => recruit.company, {
    cascade: true, // 회사 삭제시 - 등록한 채용공고도 같이삭제.
  })
  recruits: Recruit[];
}

Recruit.entity.ts - 채용공고 모델
import configs from '../configs';
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './Company.entity';

@Entity()
export class Recruit {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  position: string; //채용포지션

  @Column()
  bonusMoney: number; //채용보상금

  @Column()
  content: string; //채용내용

  @Column()
  technique: string; // 사용기술

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  // 회사 아이디 (FK)
  @ManyToOne((type) => Company, (company) => company.recruits, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  company: Company;
}


요구사항 구현 과정 - (요구사항: #1, #2, #3, #4-1, #4-2, #5)
Router
[파일위치] /src/routers/recruit.ts

import { Router } from 'express';
import errorHandlers from '../middlewares/errorHandler';
import {
  createNewRecruit,
  updateRecruit,
  allRecruits,
  detailRecruit,
  deleteRecruit,
  searchRecruits,
} from '../controllers/recruitController';

const router = Router();

router.post('/', createNewRecruit, errorHandlers); // 채용공고 생성
router.get('/', allRecruits, errorHandlers); // 모든 채용공고 조회
router.get('/url', searchRecruits, errorHandlers); //채용공고 검색
router.get('/:id', detailRecruit, errorHandlers); // 상세페이지 조회
router.put('/:id', updateRecruit, errorHandlers); // 채용공고 수정
router.delete('/:id', deleteRecruit, errorHandlers); //채용공고 삭제

export default router;
