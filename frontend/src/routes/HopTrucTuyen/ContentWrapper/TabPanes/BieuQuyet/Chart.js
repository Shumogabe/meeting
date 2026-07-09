import React from "react";

const PartyData = [
  {
    party: "Labour",
    voteShare: 100,
    change: 0,
    color: "red",
    icon: "red",
  },
  {
    party: "Conservative",
    voteShare: 50,
    change: -9,
    color: "blue",
    icon: "blue",
  },
  {
    party: "Liberal Democrat",
    voteShare: 20,
    change: 4,
    color: "orange",
    icon: "orange",
  },
  {
    party: "Others",
    voteShare: 10,
    change: 5,
    color: "gray",
    icon: "gray",
  },
];

const PartyRow = ({ party, voteShare, change, color }) => (
  <tr key={party}>
    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
        <span>{party}</span>
      </div>
    </td>
    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: voteShare + "px",
            height: "10px",
            backgroundColor: color,
          }}
        />
        {voteShare}%
      </div>
    </td>
    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {change > 0 ? (
          <span style={{ color: "green" }}>+{change}</span>
        ) : (
          <span style={{ color: "red" }}>{change}</span>
        )}
      </div>
    </td>
  </tr>
);

const ProjectedNationalShare = () => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "5px",
    }}
  >
    <h2
      style={{
        marginBottom: "10px",
      }}
    >
      Projected National Share in Great Britain
    </h2>
    <p>
      Estimates for how the results would have been if the whole country were
      voting in local elections
    </p>
    <table>
      <thead>
        <tr>
          <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            Party
          </th>
          <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            Projected Vote Share
          </th>
          <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            Change
          </th>
        </tr>
      </thead>
      <tbody>
        {PartyData.map((party) => (
          <PartyRow
            key={party.party}
            party={party.party}
            voteShare={party.voteShare}
            change={party.change}
            color={party.color}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default ProjectedNationalShare;
