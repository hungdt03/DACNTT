import React, { useEffect, useState } from 'react'
import { Layout, Card, Row, Col, Statistic, Button, Space, Select } from 'antd'
import { StockOutlined, WarningOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import { Pie, Line, Bar } from '@ant-design/plots'
import adminService from '../../services/adminService'

const { Content } = Layout
const { Option } = Select

const StatisticsPage: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
    const [selectedYear, setSelectedYear] = useState<number | null>(null)
    const [countAllUser, setCountAllUser] = useState<number>(0)
    const [countAllPost, setCountAllPost] = useState<number>(0)
    const [countAllGroup, setCountAllGroup] = useState<number>(0)
    const [countAllReport, setCountAllReport] = useState<number>(0)
    const [allUserConnection, setAllUserConnection] = useState<number>(0)
    const [allUserDisConnection, setAllUserDisConnection] = useState<number>(0)
    const [selectedStatYear, setSelectedStatYear] = useState<number | null>(null)
    const [inventoryData, setInventoryData] = useState<{ type: string; value: number }[]>([])
    const [top10UserScore, setTop10UserScore] = useState<{ name: string; score: number }[]>([])
    const [registrationStats, setRegistrationStats] = useState<{ year: number; month: number; count: number }[]>([])
    const [registrationYear, setRegistrationYear] = useState<number[]>([])
    console.log(registrationStats)
    const fetchTop10UserScore = async () => {
        const response = await adminService.GetTop10UserScore()
        if (response.isSuccess && response.data) {
            const top10Scores = response.data.map((user) => ({
                name: user.user.fullName,
                score: user.score
            }))

            setTop10UserScore(top10Scores)
        }
    }
    const fetchRegistrationYear = async () => {
        const response = await adminService.GetYear()
        if (response.isSuccess) {
            setRegistrationYear(response.data)
            setSelectedStatYear(response.data[0])
            handleRegistrationStats(response.data[0])
        }
    }
    const handleRegistrationStats = async (year: number) => {
        const response = await adminService.GetRegistrationStatsByYear(year)
        setSelectedStatYear(year)
        if (response.isSuccess) {
            const statsMap = new Map<number, number>()
            for (let i = 1; i <= 12; i++) {
                statsMap.set(i, 0)
            }

            response.data.forEach((stat) => {
                statsMap.set(stat.month, stat.count)
            })

            const stats = Array.from(statsMap, ([month, count]) => ({
                year,
                month,
                count
            }))

            setRegistrationStats(stats)
        }
    }
    const fetchAndUpdateInventoryData = async () => {
        const userRes = await adminService.CountAllUser()
        const lockedRes = await adminService.CountAllUserIsLock()

        if (userRes.isSuccess && lockedRes.isSuccess) {
            setCountAllUser(userRes.data)

            setInventoryData([
                { type: 'Tài khoản hoạt động', value: userRes.data - lockedRes.data },
                { type: 'Tài khoản khóa', value: lockedRes.data }
            ])
        }
    }
    const fetchGetAllUserConnection = async () => {
        const response = await adminService.GetAllUserConnection()
        const userRes = await adminService.CountAllUser()
        if (response.isSuccess) {
            setAllUserConnection(response.data)
            setAllUserDisConnection(userRes.data - response.data)
        }
    }
    const fetchCountAllPost = async () => {
        const response = await adminService.CountAllPost()
        if (response.isSuccess) {
            setCountAllPost(response.data)
        }
    }
    const fetchCountAllGroup = async () => {
        const response = await adminService.CountAllGroup()
        if (response.isSuccess) {
            setCountAllGroup(response.data)
        }
    }
    const fetchCountAllReport = async () => {
        const response = await adminService.CountAllReport()
        if (response.isSuccess) {
            setCountAllReport(response.data)
        }
    }

    const handleMonthChange = (value: number) => {
        setSelectedMonth(value)
    }

    const handleYearChange = (value: number) => {
        setSelectedYear(value)
    }

    const resetFilters = () => {
        setSelectedMonth(null)
        setSelectedYear(null)
    }

    useEffect(() => {
        fetchAndUpdateInventoryData()
        fetchCountAllGroup()
        fetchCountAllPost()
        fetchCountAllReport()
        fetchGetAllUserConnection()
        fetchTop10UserScore()
        fetchRegistrationYear()
        resetFilters()
    }, [])

    const filteredExpenseData = registrationStats.filter(
        (item) =>
            (!selectedMonth ||
                new Date(`2023-${selectedMonth}-01`).getMonth() + 1 ===
                    new Date(`2023-${item.month}-01`).getMonth() + 1) &&
            (!selectedYear || item.year === selectedYear)
    )

    const totalAccountInteraction = filteredExpenseData.reduce((total, item) => total + item.count, 0)

    return (
        <Layout style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <Content style={{ flex: 1, overflow: 'hidden' }}>
                <Row gutter={[16, 16]} style={{ marginBottom: '10px', justifyContent: 'center', textAlign: 'center' }}>
                    <Col>
                        <Space>
                            <Select placeholder='Chọn tháng' style={{ width: 120 }} onChange={handleMonthChange}>
                                {[...Array(12)].map((_, i) => (
                                    <Option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</Option>
                                ))}
                            </Select>
                            <Select placeholder='Chọn năm' style={{ width: 120 }} onChange={handleYearChange}>
                                {[2022, 2023, 2024].map((year) => (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                ))}
                            </Select>
                            <Button onClick={resetFilters}>Cài lại</Button>
                            <Button type='primary' style={{ width: 120 }}>
                                Lọc
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <Col span={4}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center', height: 100 }}>
                            <Statistic title='Tổng số tài khoản' value={countAllUser} prefix={<UserOutlined />} />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center', height: 100 }}>
                            <Statistic title='Tổng số bài viết' value={countAllPost} prefix={<StockOutlined />} />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center', height: 100 }}>
                            <Statistic title='Tổng số nhóm' value={countAllGroup} prefix={<TeamOutlined />} />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center', height: 100 }}>
                            <Statistic title='Đang trực tuyến' value={allUserConnection} prefix={<TeamOutlined />} />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center', height: 100 }}>
                            <Statistic
                                title='Đang ngoại tuyến'
                                value={allUserDisConnection}
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card
                            style={{
                                borderRadius: '10px',
                                textAlign: 'center',
                                background: '#FFEDED',
                                border: '1px solid red',
                                height: 100
                            }}
                        >
                            <Statistic title='Tổng số báo cáo' value={countAllReport} prefix={<WarningOutlined />} />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[12, 12]}>
                    <Col span={16}>
                        <Row gutter={[12, 12]}>
                            <Col span={12}>
                                <Card title='Tài khoản' style={{ borderRadius: '10px', height: '180px' }}>
                                    <Pie data={inventoryData} angleField='value' colorField='type' height={110} />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    title='Tài khoản có lượt tương tác cao nhất'
                                    style={{ borderRadius: '10px', textAlign: 'center', height: '180px' }}
                                >
                                    <Statistic value={totalAccountInteraction || 0} prefix={<UserOutlined />} />
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={[12, 12]} style={{ marginTop: '10px' }}>
                            <Col span={24} style={{ height: '100%' }}>
                                <Card
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span>Tổng số tài khoản đăng ký</span>
                                            <Select
                                                value={selectedStatYear}
                                                placeholder='Chọn năm'
                                                style={{ marginLeft: '10px', width: '120px' }}
                                                onChange={(value) => handleRegistrationStats(value)}
                                            >
                                                {registrationYear.map((year) => (
                                                    <Option key={year} value={year}>
                                                        {year}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    }
                                    style={{ borderRadius: '10px' }}
                                >
                                    <Line
                                        data={registrationStats}
                                        xField='month'
                                        yField='count'
                                        height={220}
                                        point={{ size: 5, shape: 'circle' }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Card
                            title='Top 10 tài khoản có lượt tương tác cao nhất'
                            style={{ borderRadius: '10px', height: '100%' }}
                        >
                            <Bar data={top10UserScore} xField='name' yField='score' height={400} />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export default StatisticsPage
