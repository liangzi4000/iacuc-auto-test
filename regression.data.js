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
        answer: 'Answer the test preliminary check message detail'
    }
}