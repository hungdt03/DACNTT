import React from 'react'
import { Layout, Card, Row, Col, Statistic } from 'antd'
import { ShoppingCartOutlined, StockOutlined, WarningOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import { Pie, Line, Bar } from '@ant-design/plots'

const { Content } = Layout

// Dữ liệu biểu đồ
const inventoryData = [
    { type: 'Tài khoản hoạt động', value: 32 },
    { type: 'Tài khoản khóa', value: 68 }
]

const expenseData = [
    { month: 'Dec', value: 20000, type: 'Đăng ký' },
    { month: 'Jan', value: 25000, type: 'Đăng ký' },
    { month: 'Feb', value: 23000, type: 'Đăng ký' },
    { month: 'Mar', value: 28000, type: 'Đăng ký' },
    { month: 'Apr', value: 30000, type: 'Đăng ký' },
    { month: 'May', value: 35000, type: 'Đăng ký' },
    { month: 'Jun', value: 2000, type: 'Đăng ký' },
    { month: 'Oct', value: 12300, type: 'Đăng ký' },
    { month: 'Nov', value: 12000, type: 'Đăng ký' },
    { month: 'July', value: 38000, type: 'Đăng ký' },
    { month: 'Aug', value: 40000, type: 'Đăng ký' },
    { month: 'Step', value: 35000, type: 'Đăng ký' }
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
    return (
        <Layout style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <Content style={{ flex: 1, overflow: 'hidden' }}>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center' }}>
                            <Statistic title='Tổng số tài khoản' value={5483} prefix={<ShoppingCartOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center' }}>
                            <Statistic title='Tổng số bài viết' value={2859} prefix={<StockOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center' }}>
                            <Statistic title='Tổng số nhóm' value={5483} prefix={<TeamOutlined />} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card
                            style={{
                                borderRadius: '10px',
                                textAlign: 'center',
                                background: '#FFEDED',
                                border: '1px solid red'
                            }}
                        >
                            <Statistic title='Tổng số báo cáo' value={38} prefix={<WarningOutlined />} />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[12, 12]} style={{ marginTop: '15px' }}>
                    <Col span={5}>
                        <Card title='Tài khoản' style={{ borderRadius: '10px', height: '200px' }}>
                            <Pie data={inventoryData} angleField='value' colorField='type' height={120} />
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card style={{ borderRadius: '10px', textAlign: 'center', height: '200px' }}>
                            <Statistic
                                title='Tài khoản cao nhất về lượt tương tác'
                                value={'583 K'}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={14}>
                        <Card
                            title='10 tài khoản có lượt tương tác cao nhất'
                            style={{ borderRadius: '10px', height: '200px' }}
                        >
                            <Bar data={storeSales} xField='name' yField='reaction' height={120} />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: '15px' }}>
                    <Col span={24}>
                        <Card title='Tổng số tài khoản đăng ký theo tháng' style={{ borderRadius: '10px' }}>
                            <Line data={expenseData} xField='month' yField='value' seriesField='type' height={180} />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export default StatisticsPage
