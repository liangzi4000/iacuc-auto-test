module.exports = {
    Environment: {
        host: 'http://localhost:10000',
        resolution: { width: 1366, height: 662 }
    },
    Delegate: {
        loginid: 'ncmhth',
        password: 'ishare123',
        profile: { name: 'Huynh The Hung', cert: 'qwgopjeg', contact: '59032892', qualification: 'MBBS' }
    },
    PI: {
        loginid: 'ncmhkm',
        password: 'ishare123',
        profile: { name: 'Hui Kam Man', cert: 'qhgg03', contact: '45981924', qualification: 'PhD' }
    },
    TeamMember: [
        { name: 'Bahjin Sawadjaan Fatimin Leila', cert: 'agjjeog', contact: '67122553', qualification: 'BSc' },
        { name: 'Cheng Skye H.', cert: 'w5hwh', contact: '78904433', qualification: 'BSc' },
        { name: 'Chen Yudong', cert: 't7tkeh', contact: '45898040', qualification: 'BSc' },
        { name: 'Ang Han Nian Marcus', cert: '90ehar', contact: '83945730', qualification: 'Dipl' }
    ],
    YearAndNumber: { year: 2, number: [50, 20] },
    Vet: {
        loginid: 'srrbog',
        password: 'secretabc',
        profile: { id: '65b72ffa-c17b-4234-9a95-78dbd277ca54', name: 'Ogden Bryan' }
    },
    Secretariat: {
        loginid: 'srrlhl',
        password: 'secretabc'
    },
    PreliminaryCheck: {
        subject: `Preliminary check message subject ${+new Date()}`,
        question: 'Test preliminary check message detail',
        answer: 'Answer the test preliminary check message detail',
        formchange: {
            sectionB: 'Edit section B for preliminary check',
            sectionC: 'Edit section C for preliminary check',
            sectionD: 'Edit section D for preliminary check'
        }
    },
    Meeting: {
        id: '878c7d7e-5b55-4b51-b33f-d561cc3412d3'
    },
    Chairman: {
        loginid: 'eriabv',
        password: 'secretabc'
    },
    PR: {
        loginid: 'ralph.bunte@duke-nus.edu.sg',
        password: 'secretabc',
        profile: { memid: '0c142f2d-02c9-489e-bd24-a792917ea8c0' },
        comment: 'PR comment',
        role: 'PR'
    },
    SR: {
        loginid: 'srrmto',
        password: 'secretabc',
        profile: { memid: 'c95737ee-0762-4ea3-8e7b-1828baf16204' },
        comment: 'SR comment',
        role: 'SR'
    },
    OtherReviewer: {
        loginid: 'srrbog',
        password: 'secretabc',
        comment: 'Other Reviewer comment',
        role: 'OtherReviewer'
    },
    ReviewerComment: {
        subject: `Reviewer Comment ${+new Date()}`,
        answer: 'Answer the test revier comment detail',
        formchange: {
            sectionB: 'Edit section B for reviewer comment',
            sectionC: 'Edit section C for reviewer comment',
            sectionD: 'Edit section D for reviewer comment'
        }
    }

}