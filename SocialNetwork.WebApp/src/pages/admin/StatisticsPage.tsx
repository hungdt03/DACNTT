import React, { useEffect, useState } from 'react'
import { Layout, Card, Row, Col, Statistic, Select, Avatar, Typography } from 'antd'
import { StockOutlined, WarningOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import { Pie, Line, Bar } from '@ant-design/plots'
import adminService from '../../services/adminService'
import { UserResource } from '../../types/user'

const { Content } = Layout
const { Option } = Select

const StatisticsPage: React.FC = () => {
    const [countAllUser, setCountAllUser] = useState<number>(0)
    const [countAllPost, setCountAllPost] = useState<number>(0)
    const [countAllGroup, setCountAllGroup] = useState<number>(0)
    const [countAllReport, setCountAllReport] = useState<number>(0)
    const [allUserConnection, setAllUserConnection] = useState<number>(0)
    const [allUserDisConnection, setAllUserDisConnection] = useState<number>(0)
    const [selectedStatYear, setSelectedStatYear] = useState<number | null>(null)
    const [inventoryData, setInventoryData] = useState<{ type: string; value: number }[]>([])
    const [top10UserScore, setTop10UserScore] = useState<{ name: string; score: number }[]>([])
    const [registrationStats, setRegistrationStats] = useState<{ month: string; year: number; count: number }[]>([])
    const [registrationYear, setRegistrationYear] = useState<number[]>([])
    const [top1Followers, setTop1Followers] = useState<UserResource>()
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
            const expenseData = response.data.map((stat) => ({
                month: `Tháng ${stat.month}`,
                count: stat.count,
                year: stat.year
            }))
            setRegistrationStats(expenseData)
        }
    }
    const fetchAndUpdateInventoryData = async () => {
        const userRes = await adminService.CountAllUser()
        const lockedRes = await adminService.CountAllUserIsLock()

        if (userRes.isSuccess && lockedRes.isSuccess) {
            setCountAllUser(userRes.data)

            setInventoryData([
                { type: 'Hoạt động', value: userRes.data - lockedRes.data },
                { type: 'Khóa', value: lockedRes.data }
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
    const fetchGetTop1Followers = async () => {
        const response = await adminService.GetTop1Followers()
        if (response.isSuccess) {
            setTop1Followers(response.data)
        }
    }
    const fetchCountAllReport = async () => {
        const response = await adminService.CountAllReport()
        if (response.isSuccess) {
            setCountAllReport(response.data)
        }
    }

    useEffect(() => {
        fetchAndUpdateInventoryData()
        fetchCountAllGroup()
        fetchCountAllPost()
        fetchCountAllReport()
        fetchGetAllUserConnection()
        fetchTop10UserScore()
        fetchRegistrationYear()
        fetchGetTop1Followers()
    }, [])

    return (
        <Layout style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <Content style={{ flex: 1, overflow: 'hidden' }}>
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
                                <Card
                                    title='Tài khoản'
                                    style={{
                                        borderRadius: '10px',
                                        textAlign: 'center',
                                        height: '180px',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Pie data={inventoryData} angleField='value' colorField='type' height={110} />
                                </Card>
                            </Col>

                            <Col span={12}>
                                <Card
                                    title='Tài khoản có lượt theo dõi nhiều nhất'
                                    style={{
                                        borderRadius: '10px',
                                        textAlign: 'center',
                                        height: '180px',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        display: 'flex'
                                    }}
                                >
                                    <Avatar size={64} src={top1Followers?.avatar} />
                                    <Typography.Text
                                        style={{
                                            marginTop: 5,
                                            fontSize: 16,
                                            fontWeight: 600
                                        }}
                                    >
                                        {top1Followers?.fullName}
                                    </Typography.Text>
                                    <Statistic value={top1Followers?.followingCount} prefix={<UserOutlined />} />
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[12, 12]} style={{ marginTop: '10px' }}>
                            <Col span={24} style={{ height: '100%' }}>
                                <Card
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span>Tổng số tài khoản đăng ký năm</span>
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
                                        key={selectedStatYear}
                                        data={registrationStats}
                                        xField='month'
                                        yField='count'
                                        seriesField='type'
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
