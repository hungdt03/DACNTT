import { FC } from "react";
import { ReportResource } from "../../types/report";

type ReportGroupProps = {
    report: ReportResource;
}

const ReportGroup: FC<ReportGroupProps> = ({
    report
}) => {
    return <div>ReportGroup</div>
};

export default ReportGroup;
