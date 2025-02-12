import React from 'react'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'

const StatisticsPage: React.FC = () => (
    <Row gutter={16}>
        <Col span={12}>
            <Card style={{ height: 150, border: '1px solid #000' }}>
                <Statistic
                    title={<span style={{ fontWeight: 'bold' }}>Số lượng người dùng đang hoạt động</span>}
                    value={11.28}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<ArrowUpOutlined />}
                    suffix='%'
                />
            </Card>
        </Col>
        <Col span={12}>
            <Card style={{ height: 150, border: '1px solid #000' }}>
                <Statistic
                    title={<span style={{ fontWeight: 'bold' }}>Số lượng bài viết</span>}
                    value={9.3}
                    precision={2}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<ArrowDownOutlined />}
                    suffix='%'
                />
            </Card>
        </Col>
    </Row>
)

export default StatisticsPage
