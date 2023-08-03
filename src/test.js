<Labels id='team' />
          <Select
            key='team'
            style={{ width: '100%' }}
            onChange={option => handleOptionChange(option, 'team')}
            value={selectedOptions.team || teamTitle} // Set the initial value to the team title} 
          >
            <Option value={teamTitle} disabled>
              {teamTitle}
            </Option>
            {teamOptions.map(team => (
              <Option key={team} value={team}>
                {team}
              </Option>
            ))}
          </Select>