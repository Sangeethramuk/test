import React, { useState } from 'react';
import {
  Layout,
  Input,
  Table,
  Card,
  Tag,
  Space,
  Button,
  Typography,
  Row,
  Col,
  Select,
  DatePicker,
  Progress,
  Dropdown,
  Menu,
  Badge,
} from 'antd';
import {
  SearchOutlined,
  FileTextOutlined,
  ExportOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

// Mock data for demonstration
const mockPatients = [
  {
    key: '1',
    name: 'John Smith',
    patientId: 'P001',
    status: 'Ongoing',
    lastVisit: '2024-03-15',
    therapist: 'Dr. Sarah Wilson',
    treatments: [
      {
        id: 'T001',
        bodyPart: 'Right Knee',
        therapyType: 'Flexion',
        progress: 8,
        totalSessions: 12,
        romGain: '+15°',
        painScore: '3/10',
        adherenceRate: '92%',
        tags: ['Missed Sessions', 'Doctor Note Added'],
      },
    ],
  },
  {
    key: '2',
    name: 'Emma Johnson',
    patientId: 'P002',
    status: 'Completed',
    lastVisit: '2024-03-10',
    therapist: 'Dr. Michael Brown',
    treatments: [
      {
        id: 'T002',
        bodyPart: 'Left Shoulder',
        therapyType: 'Range of Motion',
        progress: 12,
        totalSessions: 12,
        romGain: '+25°',
        painScore: '2/10',
        adherenceRate: '100%',
        tags: ['Completed'],
      },
    ],
  },
];

const PatientOverview = () => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Patient ID',
      dataIndex: 'patientId',
      key: 'patientId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Ongoing' ? 'green' : status === 'Completed' ? 'blue' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      sorter: (a, b) => new Date(a.lastVisit) - new Date(b.lastVisit),
    },
    {
      title: 'Assigned Therapist',
      dataIndex: 'therapist',
      key: 'therapist',
    },
  ];

  const renderTreatmentCard = (treatment) => (
    <Card
      key={treatment.id}
      style={{ marginBottom: 16 }}
      title={
        <Space>
          <Text strong>{treatment.bodyPart}</Text>
          <Text type="secondary">- {treatment.therapyType}</Text>
        </Space>
      }
      extra={
        <Space>
          <Button type="primary" icon={<FileTextOutlined />}>
            View Report
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="insurance">Insurance Summary</Menu.Item>
                <Menu.Item key="clinical">Clinical Summary</Menu.Item>
              </Menu>
            }
          >
            <Button icon={<ExportOutlined />}>Export</Button>
          </Dropdown>
          <Button icon={<EditOutlined />}>Add Note</Button>
        </Space>
      }
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Progress
            percent={Math.round((treatment.progress / treatment.totalSessions) * 100)}
            format={() => `${treatment.progress}/${treatment.totalSessions} Sessions`}
          />
        </Col>
        <Col span={8}>
          <Text strong>ROM Gain:</Text>
          <Text> {treatment.romGain}</Text>
        </Col>
        <Col span={8}>
          <Text strong>Pain Score:</Text>
          <Text> {treatment.painScore}</Text>
        </Col>
        <Col span={8}>
          <Text strong>Adherence:</Text>
          <Text> {treatment.adherenceRate}</Text>
        </Col>
        <Col span={24}>
          <Space>
            {treatment.tags.map((tag) => (
              <Tag key={tag} color={tag === 'Completed' ? 'green' : 'orange'}>
                {tag}
              </Tag>
            ))}
          </Space>
        </Col>
      </Row>
    </Card>
  );

  const expandedRowRender = (record) => (
    <div style={{ padding: '16px' }}>
      <Title level={4}>Ongoing Treatments</Title>
      {record.treatments.map(renderTreatmentCard)}
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: '16px 0' }}>
              Patient Overview
            </Title>
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<PlusOutlined />}>
                New Patient
              </Button>
              <Button icon={<ReloadOutlined />}>
                Refresh
              </Button>
              <Button icon={<SettingOutlined />}>
                Settings
              </Button>
              <Badge status="success" text="Viewing as Therapist" />
            </Space>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col span={16}>
            <Card>
              <Search
                placeholder="Search by patient name, ID, or DOB"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                style={{ marginBottom: 16 }}
              />
              <Table
                columns={columns}
                dataSource={mockPatients}
                expandable={{
                  expandedRowRender,
                  expandedRowKeys: expandedRows,
                  onExpand: (expanded, record) => {
                    setExpandedRows(expanded ? [record.key] : []);
                    setSelectedPatient(expanded ? record : null);
                  },
                }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Filters">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Select
                  placeholder="Treatment Status"
                  style={{ width: '100%' }}
                  options={[
                    { value: 'ongoing', label: 'Ongoing' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'dropped', label: 'Dropped' },
                  ]}
                />
                <Select
                  placeholder="Assigned Therapist"
                  style={{ width: '100%' }}
                  options={[
                    { value: 'dr_wilson', label: 'Dr. Sarah Wilson' },
                    { value: 'dr_brown', label: 'Dr. Michael Brown' },
                  ]}
                />
                <RangePicker style={{ width: '100%' }} />
                <Select
                  placeholder="Body Part / Therapy Type"
                  style={{ width: '100%' }}
                  options={[
                    { value: 'knee', label: 'Knee' },
                    { value: 'shoulder', label: 'Shoulder' },
                    { value: 'back', label: 'Back' },
                  ]}
                />
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default PatientOverview; 