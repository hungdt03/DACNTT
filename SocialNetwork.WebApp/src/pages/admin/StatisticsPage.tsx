import React, { useEffect, useState } from 'react'
import { Layout, Card, Row, Col, Statistic, Button, Space, Select } from 'antd'
import { StockOutlined, WarningOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import { Pie, Line, Bar } from '@ant-design/plots'
import adminService from '../../services/adminService'

const { Content } = Layout
const { Option } = Select

const expenseData = [
    { month: 'Dec', value: 20000, type: 'Đăng ký', year: 2022, day: 1 },
    { month: 'Jan', value: 25000, type: 'Đăng ký', year: 2023, day: 15 },
    { month: 'Feb', value: 23000, type: 'Đăng ký', year: 2023, day: 10 },
    { month: 'Mar', value: 28000, type: 'Đăng ký', year: 2023, day: 20 },
    { month: 'Apr', value: 30000, type: 'Đăng ký', year: 2023, day: 5 },
    { month: 'May', value: 35000, type: 'Đăng ký', year: 2023, day: 25 },
    { month: 'Jun', value: 2000, type: 'Đăng ký', year: 2023, day: 30 },
    { month: 'Oct', value: 12300, type: 'Đăng ký', year: 2023, day: 12 },
    { month: 'Nov', value: 12000, type: 'Đăng ký', year: 2023, day: 18 },
    { month: 'July', value: 38000, type: 'Đăng ký', year: 2023, day: 22 },
    { month: 'Aug', value: 100000, type: 'Đăng ký', year: 2023, day: 8 },
    { month: 'Sep', value: 35000, type: 'Đăng ký', year: 2023, day: 14 }
]

const storeSales = [
    { name: 'Hoàng', reaction: 874 },
    { name: 'Hưng', reaction: 721 },
    { name: 'Kiên', reaction: 598 },
    { name: 'Huy', reaction: 586 },
    { name: 'Cương', reaction: 395 },
    { name: 'Biên', reaction: 344 },
    { name: 'Đăng', reaction: 274 },
    { name: 'Như', reaction: 213 },
    { name: 'Chi', reaction: 183 },
    { name: 'Sang', reaction: 176 }
]

const StatisticsPage: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
    const [selectedYear, setSelectedYear] = useState<number | null>(null)
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [countAllUser, setCountAllUser] = useState<number>(0)
    const [countAllPost, setCountAllPost] = useState<number>(0)
    const [countAllGroup, setCountAllGroup] = useState<number>(0)
    const [countAllReport, setCountAllReport] = useState<number>(0)
    const [countAllUserIsLock, setCountAllUserIsLock] = useState<number>(0)

    const inventoryData = [
        { type: 'Tài khoản hoạt động', value: countAllUser - countAllUserIsLock },
        { type: 'Tài khoản khóa', value: countAllUserIsLock }
    ]

    const fetchCountAllUser = async () => {
        const response = await adminService.CountAllUser()
        if (response.isSuccess) {
            setCountAllUser(response.data)
        }
    }
    const fetchCountAllUserIsLock = async () => {
        const response = await adminService.CountAllUserIsLock()
        if (response.isSuccess) {
            setCountAllUserIsLock(response.data)
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

    const handleDayChange = (value: number) => {
        setSelectedDay(value)
    }

    const resetFilters = () => {
        setSelectedMonth(null)
        setSelectedYear(null)
        setSelectedDay(null)
    }

    useEffect(() => {
        fetchCountAllUser()
        fetchCountAllUserIsLock()
        fetchCountAllGroup()
        fetchCountAllPost()
        fetchCountAllReport()
        resetFilters()
    }, [])

    const filteredExpenseData = expenseData.filter(
        (item) =>
            (!selectedDay || item.day === selectedDay) &&
            (!selectedMonth ||
                new Date(`2023-${selectedMonth}-01`).getMonth() + 1 ===
                    new Date(`2023-${item.month}-01`).getMonth() + 1) &&
            (!selectedYear || item.year === selectedYear)
    )

    const totalAccountInteraction = filteredExpenseData.reduce((total, item) => total + item.value, 0)

    return (
        <Layout style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <Content style={{ flex: 1, overflow: 'hidden' }}>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center', height: 100 }}>
                            <Statistic title='Tổng số tài khoản' value={countAllUser} prefix={<UserOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center', height: 100 }}>
                            <Statistic title='Tổng số bài viết' value={countAllPost} prefix={<StockOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center', height: 100 }}>
                            <Statistic title='Tổng số nhóm' value={countAllGroup} prefix={<TeamOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6}>
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

                <Row
                    gutter={[16, 16]}
                    style={{ marginTop: '15px', marginBottom: '10px', justifyContent: 'center', textAlign: 'center' }}
                >
                    <Col>
                        <Space>
                            <Select placeholder='Chọn ngày' style={{ width: 120 }} onChange={handleDayChange}>
                                {[...Array(31)].map((_, i) => (
                                    <Option key={i + 1} value={i + 1}>{`Ngày ${i + 1}`}</Option>
                                ))}
                            </Select>
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
                                <Card title='Tổng số tài khoản đăng ký' style={{ borderRadius: '10px' }}>
                                    <Line
                                        data={filteredExpenseData}
                                        xField='month'
                                        yField='value'
                                        seriesField='type'
                                        height={200}
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
                            <Bar data={storeSales} xField='name' yField='reaction' height={400} />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export default StatisticsPage
